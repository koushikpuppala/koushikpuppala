import { http, HttpResponse } from 'msw'
import userEvent from '@testing-library/user-event'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ResumeView } from './resume-view'
import { API, server } from '../../../test/msw'
import { describe, expect, it, vi } from 'vitest'

vi.mock('lib/firebase', () => ({ getIdToken: async () => 'id-token-1' }))

const resume = {
	id: 'resume-1',
	title: 'Koushik Puppala Resume',
	versionName: '2026.1',
	downloads: 3,
	isPublished: true,
	mediaId: 'media-1',
	media: { id: 'media-1', fileName: 'cv.pdf', url: 'https://cdn.test/resume/cv.pdf' },
	downloadFileName: 'koushik_puppala_resume_2026.1.pdf',
}

const loadResume = () => {
	const presign = vi.fn()

	server.use(
		http.get(`${API}/api/v1/resume`, () =>
			HttpResponse.json({ result: { items: [resume] }, statusCode: 200 }),
		),
		http.post(`${API}/api/v1/media/presigned-url`, () => {
			presign()
			return HttpResponse.json({ error: true }, { status: 500 })
		}),
	)

	render(<ResumeView />)

	return { presign }
}

const choose = (file: File) => {
	const input = document.querySelector<HTMLInputElement>('input[type=file]')
	if (!input) throw new Error('file input missing')
	fireEvent.change(input, { target: { files: [file] } })
}

describe('ResumeView', () => {
	it('shows the file name visitors will download', async () => {
		loadResume()

		expect(await screen.findByText('koushik_puppala_resume_2026.1.pdf')).toBeInTheDocument()
	})

	it('refuses a file that is not a PDF without uploading it', async () => {
		const { presign } = loadResume()
		await screen.findByDisplayValue('Koushik Puppala Resume')

		choose(new File(['x'], 'photo.png', { type: 'image/png' }))

		expect(await screen.findByText('The resume must be a PDF document.')).toBeInTheDocument()
		expect(presign).not.toHaveBeenCalled()
	})

	it('refuses a PDF over 10 MB without uploading it', async () => {
		const { presign } = loadResume()
		await screen.findByDisplayValue('Koushik Puppala Resume')

		const big = new File(['x'], 'cv.pdf', { type: 'application/pdf' })
		Object.defineProperty(big, 'size', { value: 12 * 1024 * 1024 })
		choose(big)

		expect(await screen.findByText('The resume PDF must be 10 MB or smaller.')).toBeInTheDocument()
		expect(presign).not.toHaveBeenCalled()
	})

	it('uploads a PDF to S3, then saves it as a new version', async () => {
		let saved: Record<string, unknown> | null = null
		server.use(
			http.get(`${API}/api/v1/resume`, () => HttpResponse.json({ result: { items: [] }, statusCode: 200 })),
			http.post(`${API}/api/v1/media/presigned-url`, () =>
				HttpResponse.json({ result: { uploadUrl: 'https://bucket.test/upload', storageKey: 'resume/new.pdf', url: '' } }),
			),
			http.put('https://bucket.test/upload', () => new HttpResponse(null, { status: 200 })),
			http.post(`${API}/api/v1/media/complete`, () =>
				HttpResponse.json({ result: { id: 'media-2', fileName: 'new.pdf', url: 'https://cdn.test/resume/new.pdf', storageKey: 'resume/new.pdf' } }),
			),
			http.post(`${API}/api/v1/resume`, async ({ request }) => {
				saved = (await request.json()) as Record<string, unknown>
				return HttpResponse.json({ result: { ...saved, id: 'resume-2', downloadFileName: 'ada_2026.2.pdf' } }, { status: 201 })
			}),
		)
		render(<ResumeView />)
		const title = await screen.findByLabelText(/document title/i)

		expect(screen.getByRole('button', { name: 'Save Changes' })).toBeDisabled()

		await userEvent.click(screen.getByLabelText(/executive summary/i))
		await userEvent.paste('Three years.')
		await userEvent.click(screen.getByRole('button', { name: 'Save Changes' }))
		expect(await screen.findByText('Document title is required.')).toBeInTheDocument()

		await userEvent.click(title)
		await userEvent.paste('Ada Resume')
		await userEvent.click(screen.getByRole('button', { name: 'Save Changes' }))
		expect(await screen.findByText('Release version tag is required.')).toBeInTheDocument()

		await userEvent.click(screen.getByLabelText(/release version tag/i))
		await userEvent.paste('2026.2')
		await userEvent.click(screen.getByRole('button', { name: 'Save Changes' }))
		expect(await screen.findByText('Upload a PDF before saving the resume.')).toBeInTheDocument()

		choose(new File(['%PDF'], 'new.pdf', { type: 'application/pdf' }))
		expect(await screen.findByText(/Uploaded new.pdf to AWS S3/)).toBeInTheDocument()

		await userEvent.click(screen.getByRole('button', { name: 'Save Changes' }))

		await waitFor(() =>
			expect(saved).toMatchObject({
				title: 'Ada Resume',
				versionName: '2026.2',
				summary: 'Three years.',
				mediaId: 'media-2',
				fileType: 'application/pdf',
				isPublished: false,
			}),
		)
		expect(await screen.findByText('ada_2026.2.pdf')).toBeInTheDocument()
		expect(screen.getByText(/saved as a draft/i)).toBeInTheDocument()
	})

	it('shows the upload error when S3 refuses the file', async () => {
		loadResume()
		await screen.findByDisplayValue('Koushik Puppala Resume')

		choose(new File(['%PDF'], 'cv.pdf', { type: 'application/pdf' }))

		expect(await screen.findByText(/presigned upload URL|HTTP 500/i)).toBeInTheDocument()
	})

	it('ignores a cleared file input', async () => {
		const { presign } = loadResume()
		await screen.findByDisplayValue('Koushik Puppala Resume')

		const input = document.querySelector<HTMLInputElement>('input[type=file]') as HTMLInputElement
		fireEvent.change(input, { target: { files: [] } })

		expect(presign).not.toHaveBeenCalled()
	})
})
