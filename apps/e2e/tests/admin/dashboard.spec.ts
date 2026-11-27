import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { signIn } from '../../fixtures/admin'

const THEMES = ['light', 'dark'] as const

for (const theme of THEMES) {
	test.describe(`dashboard (${theme})`, () => {
		test.beforeEach(async ({ page }) => {
			await signIn(page)
			await page.addInitScript(value => localStorage.setItem('kp.admin.theme', value), theme)
			await page.goto('/')
		})

		test('shows the strip, four cards and has no axe violations', async ({ page }) => {
			await expect(page.getByRole('region', { name: 'Needs your attention' })).toBeVisible()
			await expect(page.getByRole('heading', { name: 'System health' })).toBeVisible()
			await expect(page.getByText('Checking…')).toHaveCount(0)

			const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze()

			expect(results.violations).toEqual([])
		})

		test('uses one column without horizontal scroll on a phone', async ({ page }) => {
			await page.setViewportSize({ width: 360, height: 800 })
			await page.goto('/')
			await expect(page.getByRole('heading', { name: 'Recent messages' })).toBeVisible()

			const overflow = await page.evaluate(
				() => document.documentElement.scrollWidth - document.documentElement.clientWidth,
			)

			expect(overflow).toBeLessThanOrEqual(0)
		})
	})
}
