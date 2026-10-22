import { http, HttpResponse } from 'msw'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { API, server } from '../../../test/msw'
import { ProjectFormDialog } from 'components/projects/project-form-dialog'
import { ExperienceFormDialog } from 'components/experience/experience-form-dialog'
import { EducationFormDialog } from 'components/education/education-form-dialog'
import { ServiceFormDialog } from 'components/services/service-form-dialog'
import { SocialFormDialog } from 'components/socials/social-form-dialog'

vi.mock('lib/firebase', () => ({ getIdToken: async () => 'id-token-1' }))

const type = (label: string | RegExp, text: string) => userEvent.type(screen.getByLabelText(label), text)

const addItems = async (placeholder: string, ...items: string[]) => {
	for (const item of items) await userEvent.type(screen.getByLabelText(placeholder), `${item}{Enter}`)
}

const pick = async (label: string | RegExp, option: string | RegExp) => {
	await userEvent.click(screen.getByRole('button', { name: label }))
	await userEvent.click(await screen.findByRole('option', { name: option }))
}

const pickDay = async (label: string | RegExp, day: number) => {
	await userEvent.click(screen.getByRole('button', { name: label }))
	const button = screen
		.getAllByRole('button')
		.find(b => b.classList.contains('rdrDay') && !b.classList.contains('rdrDayPassive') && b.textContent === String(day))
	await userEvent.click(button as HTMLElement)
}

const save = (label: string) => userEvent.click(screen.getByRole('button', { name: label }))

const setup = () => ({ onSave: vi.fn(async (_payload: unknown) => undefined), onOpenChange: vi.fn() })

describe('ProjectFormDialog', () => {
	it('creates a project from every field, deriving the slug from the title', async () => {
		const { onSave, onOpenChange } = setup()
		server.use(
			http.get(`${API}/api/v1/media`, () =>
				HttpResponse.json({ result: { items: [{ id: 'm1', fileName: 'cover.png', originalName: 'cover.png', url: 'https://cdn.test/cover.png', mimeType: 'image/png' }], pagination: { total: 1 } } }),
			),
		)
		render(<ProjectFormDialog open onOpenChange={onOpenChange} project={null} onSave={onSave} />)

		await type('Title', 'Payments Platform!')
		expect(screen.getByLabelText('Slug')).toHaveValue('payments-platform')
		await type('Subtitle', 'Card issuing')
		await userEvent.clear(screen.getByLabelText('Category'))
		await type('Category', 'Fintech')
		await userEvent.clear(screen.getByLabelText('Project Type'))
		await type('Project Type', 'Platform')
		await type('Short Summary', 'Cards for employees.')
		await addItems('Add feature/architecture description bullet…', 'Ledger', 'Settlement')
		await userEvent.click(screen.getByRole('button', { name: 'Remove Settlement' }))
		await type('Case Study Narrative', 'Long story.')
		await addItems('Add filter tag (e.g. Next.js 16, Redis)…', 'fintech')
		await addItems('Add technology tag (e.g. Docker, PostgreSQL)…', 'NestJS', 'React')
		await userEvent.click(screen.getByRole('button', { name: 'Remove React' }))
		await type('GitHub Repository', 'https://github.com/ada/payments')
		await type('Live Production URL', 'https://payments.example.com')
		await userEvent.click(screen.getByLabelText('Feature on Homepage'))
		await pick(/status/i, /^PUBLISHED/)
		await pick(/lifecycle/i, /IN PROGRESS/)

		await userEvent.click(screen.getByRole('button', { name: /select cover from s3/i }))
		const picker = await screen.findByRole('dialog', { name: /select project cover/i })
		await userEvent.click(await within(picker).findByRole('button', { name: /cover\.png/ }))
		await userEvent.click(within(picker).getAllByRole('button').at(-1) as HTMLElement)
		await waitFor(() => expect(screen.queryByRole('dialog', { name: /select project cover/i })).not.toBeInTheDocument())

		await save('Save Project')

		await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false))
		expect(onSave).toHaveBeenCalledWith({
			title: 'Payments Platform!',
			slug: 'payments-platform',
			subtitle: 'Card issuing',
			category: 'Fintech',
			projectType: 'Platform',
			shortDescription: 'Cards for employees.',
			descriptions: ['Ledger'],
			caseStudy: 'Long story.',
			tags: ['fintech'],
			technologies: ['NestJS'],
			github: 'https://github.com/ada/payments',
			liveUrl: 'https://payments.example.com',
			thumbnailId: 'm1',
			status: 'IN_PROGRESS',
			featured: true,
			isPublished: true,
		})
	})

	it('fills defaults for a minimal project and keeps a hand edited slug', async () => {
		const { onSave } = setup()
		render(<ProjectFormDialog open onOpenChange={vi.fn()} project={null} onSave={onSave} />)

		await type('Slug', 'custom')
		await type('Title', 'Tiny')
		expect(screen.getByLabelText('Slug')).toHaveValue('custom')
		await userEvent.clear(screen.getByLabelText('Category'))
		await userEvent.clear(screen.getByLabelText('Project Type'))
		await save('Save Project')

		await waitFor(() =>
			expect(onSave).toHaveBeenCalledWith(
				expect.objectContaining({
					slug: 'custom',
					subtitle: 'Tiny',
					category: 'Full Stack',
					projectType: 'Web Application',
					descriptions: ['Tiny'],
					caseStudy: null,
					github: null,
					liveUrl: null,
					featured: false,
					isPublished: false,
				}),
			),
		)
	})

	it('opens an existing project with missing fields filled in', () => {
		render(
			<ProjectFormDialog
				open
				onOpenChange={vi.fn()}
				onSave={vi.fn()}
				project={{ id: 'p1', title: 'Old', slug: 'old', status: 'DRAFT', thumbnail: { id: 'm1', url: 'https://cdn.test/c.png', fileName: 'c.png' } } as never}
			/>,
		)

		expect(screen.getByText('Edit Project')).toBeInTheDocument()
		expect(screen.getByLabelText('Category')).toHaveValue('Full Stack')
		expect(screen.getAllByRole('img').some(img => img.getAttribute('src') === 'https://cdn.test/c.png')).toBe(true)
	})
})

describe('ExperienceFormDialog', () => {
	it('creates a past role with dates, lists and type', async () => {
		const { onSave } = setup()
		render(<ExperienceFormDialog open onOpenChange={vi.fn()} experience={null} onSave={onSave} />)

		await type('Organization', 'Analytical Co')
		await type('Role Title', 'Engineer')
		await type('Location', 'Remote')
		await pick(/employment type/i, /intern/i)
		await pickDay(/start date/i, 3)
		await pickDay(/end date/i, 20)
		await type('Organization Website URL', 'https://analytical.example.com')
		await userEvent.click(screen.getByLabelText('Feature on portfolio'))
		await pick(/^status/i, /^PUBLISHED/)
		await addItems('Add role responsibility bullet…', 'Built the API')
		await addItems('Add measurable impact bullet…', 'Cut latency')
		await addItems('Add technology (e.g. Next.js, PostgreSQL)…', 'NestJS')
		await save('Save Experience')

		await waitFor(() => expect(onSave).toHaveBeenCalled())
		expect(onSave.mock.calls[0]?.[0]).toMatchObject({
			organization: 'Analytical Co',
			title: 'Engineer',
			location: 'Remote',
			employmentType: 'INTERN',
			website: 'https://analytical.example.com',
			isCurrent: false,
			featured: true,
			description: ['Built the API'],
			achievements: ['Cut latency'],
			technologies: ['NestJS'],
			isPublished: true,
			startDate: expect.stringMatching(/-03$/),
			endDate: expect.stringMatching(/-20$/),
		})
	})

	it('drops the end date for a current role', async () => {
		const { onSave } = setup()
		render(
			<ExperienceFormDialog
				open
				onOpenChange={vi.fn()}
				onSave={onSave}
				experience={{ id: 'e1', title: 'Engineer', organization: 'Co', startDate: '2024-01-01', endDate: '2025-01-01', isCurrent: false } as never}
			/>,
		)

		await userEvent.click(screen.getByLabelText('Currently working here'))
		expect(screen.getByRole('button', { name: /end date/i })).toBeDisabled()
		await save('Save Experience')

		await waitFor(() => expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ isCurrent: true, endDate: null })))
	})
})

describe('EducationFormDialog', () => {
	it('creates a degree with dates and lists', async () => {
		const { onSave } = setup()
		render(<EducationFormDialog open onOpenChange={vi.fn()} education={null} onSave={onSave} />)

		await type('University / Institution Name', 'University of London')
		await type('Degree', 'B.Tech')
		await type('Major / Field of Study', 'Computer Science')
		await type('Location', 'London')
		await type('Website URL', 'https://london.example.edu')
		await pickDay(/start date/i, 2)
		await pickDay(/graduation/i, 25)
		await pick(/^status/i, /^PUBLISHED/)
		await addItems('Add coursework bullet…', 'Algorithms')
		await addItems('Add academic honor or leadership milestone…', 'Dean list')
		await save('Save Education')

		await waitFor(() => expect(onSave).toHaveBeenCalled())
		expect(onSave.mock.calls[0]?.[0]).toMatchObject({
			university: 'University of London',
			degree: 'B.Tech',
			fieldOfStudy: 'Computer Science',
			location: 'London',
			website: 'https://london.example.edu',
			description: ['Algorithms'],
			achievements: ['Dean list'],
			isPublished: true,
		})
	})
})

describe('ServiceFormDialog', () => {
	it('creates a service with its features', async () => {
		const { onSave } = setup()
		render(<ServiceFormDialog open onOpenChange={vi.fn()} service={null} onSave={onSave} />)

		await type('Service Title', 'Frontend')
		await type('Description', 'Interfaces.')
		await addItems('Add feature highlight…', 'React', 'Next.js')
		await pick(/^status/i, /^PUBLISHED/)
		await save('Save Service')

		await waitFor(() =>
			expect(onSave).toHaveBeenCalledWith(
				expect.objectContaining({ title: 'Frontend', description: 'Interfaces.', features: ['React', 'Next.js'], isPublished: true }),
			),
		)
	})
})

describe('SocialFormDialog', () => {
	it('creates a visible channel with a platform and handle', async () => {
		const { onSave } = setup()
		render(<SocialFormDialog open onOpenChange={vi.fn()} social={null} onSave={onSave} />)

		await pick(/platform/i, /linkedin/i)
		await userEvent.clear(screen.getByLabelText('Display Label'))
		await type('Display Label', 'LinkedIn')
		await type('Profile URL', 'https://linkedin.com/in/ada')
		await type(/handle/i, 'ada')
		await pick(/^status/i, /^PUBLISHED/)
		await save('Save Social Link')

		await waitFor(() =>
			expect(onSave).toHaveBeenCalledWith({
				platform: 'LINKEDIN',
				label: 'LinkedIn',
				url: 'https://linkedin.com/in/ada',
				handle: 'ada',
				isVisible: true,
			}),
		)
	})
})
