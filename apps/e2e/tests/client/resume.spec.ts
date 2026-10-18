import { expect, test } from '@playwright/test'

test.describe('resume download', () => {
	test('the Download button goes through the counted download route', async ({ page }) => {
		await page.goto('/resume')

		const download = page.getByRole('link', { name: /download pdf/i })

		await expect(download).toHaveAttribute('href', '/resume/download')
		await expect(download).toHaveAttribute('rel', /nofollow/)
	})

	test('a file missing from storage sends the visitor back to /resume', async ({ request }) => {
		const res = await request.get('/resume/download', { maxRedirects: 0 })

		expect(res.status()).toBe(302)
		expect(res.headers().location).toBe('/resume#download-unavailable')
	})

	test('one click loads the download route once, then shows the resume page', async ({ page }) => {
		await page.goto('/resume')

		const loads: string[] = []
		page.on('request', request => {
			if (new URL(request.url()).pathname === '/resume/download')
				loads.push(request.headers().rsc ? 'router' : 'page')
		})

		await page.getByRole('link', { name: /download pdf/i }).click()
		await page.waitForURL(url => url.pathname === '/resume' && loads.includes('page'))

		expect(loads.filter(kind => kind === 'page')).toHaveLength(1)
		await expect(page.getByRole('status').filter({ hasText: 'available right now' })).toBeVisible()
	})
})
