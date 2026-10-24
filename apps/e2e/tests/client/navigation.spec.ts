import { expect, test } from '@playwright/test'

test.describe('site navigation', () => {
	test('the mobile menu opens, navigates and closes', async ({ page, isMobile }) => {
		test.skip(!isMobile, 'mobile menu only')

		await page.goto('/')
		await page.getByRole('button', { name: 'Open navigation menu' }).click()

		const menu = page.getByRole('navigation', { name: 'Mobile' })
		await expect(menu).toBeVisible()
		await menu.getByRole('link', { name: /projects/i }).click()

		await expect(page).toHaveURL(/\/projects$/)
		await expect(menu).toBeHidden()
	})

	test('the primary navigation reaches every section', async ({ page, isMobile }) => {
		test.skip(isMobile, 'desktop navigation only')

		await page.goto('/')
		const nav = page.getByRole('navigation', { name: 'Primary' })

		await nav.getByRole('link', { name: /projects/i }).click()
		await expect(page).toHaveURL(/\/projects$/)
	})

	test('keyboard users can reach the main navigation first', async ({ page, isMobile }) => {
		test.skip(isMobile, 'keyboard flow on desktop')

		await page.goto('/')
		await page.keyboard.press('Tab')

		await expect(page.locator(':focus')).toBeVisible()
	})
})
