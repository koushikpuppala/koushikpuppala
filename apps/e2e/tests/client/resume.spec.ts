import { expect, test } from '@playwright/test'

test.describe('resume download', () => {
	test('the Download button goes through the counted download route', async ({ page }) => {
		await page.goto('/resume')

		const download = page.getByRole('link', { name: /download pdf/i })

		await expect(download).toHaveAttribute('href', '/resume/download')
		await expect(download).toHaveAttribute('rel', /nofollow/)
	})

	test('old PDF links redirect permanently to the download route', async ({ request }) => {
		for (const path of ['/koushikpuppala_resume.pdf', '/resume/koushikpuppala_resume.pdf']) {
			const res = await request.get(path, { maxRedirects: 0 })

			expect(res.status()).toBe(308)
			expect(res.headers().location).toBe('/resume/download')
		}
	})

	test('a file missing from storage sends the visitor back to /resume', async ({ request }) => {
		const res = await request.get('/resume/download', { maxRedirects: 0 })

		expect(res.status()).toBe(302)
		expect(res.headers().location).toBe('/resume')
	})
})
