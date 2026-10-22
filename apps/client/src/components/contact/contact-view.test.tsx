import type { PublishedSocial } from 'types/models'

import { http, HttpResponse } from 'msw'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { server } from '../../../test/msw'
import { socials } from '../../../test/fixtures'
import { DEFAULT_SUBJECT } from 'constants/contact'
import { ContactView } from './contact-view'

const recaptcha = vi.hoisted(() => ({
	reCaptchaKey: undefined as string | undefined,
	executeRecaptcha: async (_action: string): Promise<string> => 'captcha-token',
}))

vi.mock('next-recaptcha-v3', () => ({ useReCaptcha: () => recaptcha }))
vi.mock('next/navigation', () => ({
	usePathname: () => '/contact',
	useRouter: () => ({ push: vi.fn(), prefetch: vi.fn() }),
}))

const SOCIALS = socials.map(s => ({ ...s, label: s.platform, handle: s.url })) as PublishedSocial[]

const renderForm = () => {
	render(<ContactView socials={SOCIALS} location='London, UK' />)
	// The form refuses submissions sent faster than a person could type.
	const later = Date.now() + 10_000
	vi.spyOn(Date, 'now').mockReturnValue(later)
}

const fill = async (values: { name?: string; email?: string; subject?: string; message?: string }) => {
	if (values.name) await userEvent.type(screen.getByLabelText(/your name/i), values.name)
	if (values.email) await userEvent.type(screen.getByLabelText(/your email/i), values.email)
	if (values.subject) await userEvent.type(screen.getByLabelText(/subject/i), values.subject)
	if (values.message) await userEvent.type(screen.getByLabelText(/message & context/i), values.message)
}

const VALID = {
	name: 'Grace Hopper',
	email: 'grace@example.com',
	message: 'I would like to talk about a compiler project.',
}

let sent: Record<string, unknown> | null

beforeEach(() => {
	sent = null
	recaptcha.reCaptchaKey = undefined
	recaptcha.executeRecaptcha = async () => 'captcha-token'
	server.use(
		http.post('*/api/contact', async ({ request }) => {
			sent = (await request.json()) as Record<string, unknown>
			return HttpResponse.json({ success: true, id: 'msg-42' }, { status: 201 })
		}),
	)
})

afterEach(() => vi.restoreAllMocks())

describe('ContactView', () => {
	it('sends a valid message with the default subject and shows a receipt', async () => {
		renderForm()
		await fill(VALID)

		await userEvent.click(screen.getByRole('button', { name: /send message/i }))

		expect(await screen.findByText('msg-42')).toBeInTheDocument()
		expect(screen.getByText('grace@example.com')).toBeInTheDocument()
		expect(screen.getByText(DEFAULT_SUBJECT)).toBeInTheDocument()
		expect(sent).toEqual({
			name: VALID.name,
			email: VALID.email,
			subject: DEFAULT_SUBJECT,
			message: VALID.message,
		})

		await userEvent.click(screen.getByRole('button', { name: /send another message/i }))

		expect(screen.getByLabelText(/your name/i)).toHaveValue('')
	})

	it('shows a field error on blur and clears it once the value is fixed', async () => {
		renderForm()
		const name = screen.getByLabelText(/your name/i)

		await userEvent.click(name)
		await userEvent.tab()

		expect(await screen.findByText(/please enter your name/i)).toBeInTheDocument()

		await userEvent.type(name, 'Grace')

		await waitFor(() => expect(screen.queryByText(/please enter your name/i)).not.toBeInTheDocument())
	})

	it('marks every invalid field on submit and sends nothing', async () => {
		renderForm()

		await userEvent.click(screen.getByRole('button', { name: /send message/i }))

		expect(await screen.findByText(/please enter your name/i)).toBeInTheDocument()
		expect(screen.getByText(/valid email address/i)).toBeInTheDocument()
		expect(sent).toBeNull()
	})

	it('fills the subject from a topic and clears it when the topic is picked again', async () => {
		renderForm()
		const topic = screen.getByRole('button', { name: /engineering role/i })

		await userEvent.click(topic)

		expect(topic).toHaveAttribute('aria-pressed', 'true')
		expect(screen.getByLabelText(/subject/i)).toHaveValue('Opportunity: Engineering Role Discussion')

		await userEvent.click(topic)

		expect(topic).toHaveAttribute('aria-pressed', 'false')
		expect(screen.getByLabelText(/subject/i)).toHaveValue('')
	})

	it('asks the visitor to slow down when the form is sent too quickly', async () => {
		render(<ContactView socials={SOCIALS} location='London, UK' />)
		await fill(VALID)
		vi.spyOn(Date, 'now').mockReturnValue(0)

		await userEvent.click(screen.getByRole('button', { name: /send message/i }))

		expect(await screen.findByText(/take a moment before submitting/i)).toBeInTheDocument()
		expect(sent).toBeNull()
	})

	it('silently drops a submission with the honeypot filled in', async () => {
		renderForm()
		await fill(VALID)
		await userEvent.type(screen.getByLabelText(/company \(leave blank\)/i), 'Spam Inc')

		await userEvent.click(screen.getByRole('button', { name: /send message/i }))

		await new Promise(resolve => setTimeout(resolve, 50))
		expect(sent).toBeNull()
		expect(screen.queryByText('msg-42')).not.toBeInTheDocument()
	})

	it('explains a failed delivery and offers the email fallback and a copyable draft', async () => {
		server.use(
			http.post('*/api/contact', () =>
				HttpResponse.json({ success: false, message: 'Too many messages.' }, { status: 429 }),
			),
		)
		const writeText = vi.fn(async () => undefined)
		Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
		renderForm()
		await fill({ ...VALID, subject: 'Compilers' })

		await userEvent.click(screen.getByRole('button', { name: /send message/i }))

		expect(await screen.findByText('Too many messages.')).toBeInTheDocument()
		expect(screen.getByRole('link', { name: /open in email client/i })).toHaveAttribute(
			'href',
			expect.stringMatching(/^mailto:ada@example\.com\?subject=Compilers/),
		)

		await userEvent.click(screen.getByRole('button', { name: /copy draft text/i }))

		expect(writeText).toHaveBeenCalledWith(
			`From: ${VALID.name} <${VALID.email}>\nSubject: Compilers\n\n${VALID.message}`,
		)
		expect(await screen.findByText('Draft Copied!')).toBeInTheDocument()
	})

	it('reports a server error that has no message by its status', async () => {
		server.use(http.post('*/api/contact', () => new HttpResponse('oops', { status: 502 })))
		renderForm()
		await fill(VALID)

		await userEvent.click(screen.getByRole('button', { name: /send message/i }))

		expect(await screen.findByText(/HTTP 502/)).toBeInTheDocument()
	})

	it('sends a reCAPTCHA token when a site key is set', async () => {
		recaptcha.reCaptchaKey = 'site-key'
		renderForm()
		await fill(VALID)

		await userEvent.click(screen.getByRole('button', { name: /send message/i }))

		await screen.findByText('msg-42')
		expect(sent).toMatchObject({ recaptchaToken: 'captcha-token' })
	})

	it('explains when the spam check cannot load', async () => {
		recaptcha.reCaptchaKey = 'site-key'
		recaptcha.executeRecaptcha = async () => {
			throw new Error('blocked')
		}
		renderForm()
		await fill(VALID)

		await userEvent.click(screen.getByRole('button', { name: /send message/i }))

		expect(await screen.findByText(/spam check could not load/i)).toBeInTheDocument()
		expect(sent).toBeNull()
	})
})
