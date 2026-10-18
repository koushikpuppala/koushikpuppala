import { http, HttpResponse } from 'msw'
import { fireEvent, render, screen } from '@testing-library/react'
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
})
