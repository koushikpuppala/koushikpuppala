import { expect, test } from '@playwright/test'

// The shared design tokens default to the values these components rendered before the admin token layer,
// so the public site must keep exactly these computed styles.
test.describe('shared components keep their public site styles', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/contact')
		await expect(page.getByLabel(/your name/i)).toBeVisible()
	})

	test('Input, Textarea and Button', async ({ page }) => {
		const input = await page.getByLabel(/your name/i).evaluate(element => {
			const style = getComputedStyle(element)
			return { height: style.height, radius: style.borderTopLeftRadius }
		})
		expect(input).toEqual({ height: '44px', radius: '9.2px' })

		const textarea = await page.getByLabel(/message/i).evaluate(element => {
			const style = getComputedStyle(element)
			return { minHeight: style.minHeight, radius: style.borderTopLeftRadius }
		})
		expect(textarea).toEqual({ minHeight: '160px', radius: '9.2px' })

		const button = await page.getByRole('button', { name: 'Send Message' }).evaluate(element => {
			const style = getComputedStyle(element)
			return { height: style.height, radius: style.borderTopLeftRadius }
		})
		expect(button).toEqual({ height: '48px', radius: '11.2px' })
	})

	test('Container and Logo', async ({ page }) => {
		// Container is only rendered on the client's error page, so check the token it reads.
		const pageWidth = await page.evaluate(() =>
			getComputedStyle(document.documentElement).getPropertyValue('--container-page').trim(),
		)
		expect(pageWidth).toBe('1440px')

		const logo = await page
			.locator('[class*="size-9"][class*="overflow-hidden"]')
			.first()
			.evaluate(element => {
				const style = getComputedStyle(element)
				return { width: style.width, radius: style.borderTopLeftRadius }
			})
		expect(logo).toEqual({ width: '36px', radius: '11.2px' })
	})
})
