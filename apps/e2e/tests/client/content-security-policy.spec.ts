import { expect, test, type Page } from '@playwright/test'
import { CONTENT } from '../../env'

const PAGES = [
	'/',
	'/about',
	'/experience',
	'/education',
	'/projects',
	`/projects/${CONTENT.publishedProject.slug}`,
	'/services',
	'/resume',
	'/contact',
]

// Records every policy violation from the first script on, so a blocked script or request fails the test.
const recordViolations = async (page: Page) => {
	await page.addInitScript(() => {
		const seen: string[] = []
		Object.assign(window, { __cspViolations: seen })
		document.addEventListener('securitypolicyviolation', event => {
			seen.push(
				`${event.effectiveDirective} blocked ${event.blockedURI || 'inline code'} (from ${event.sourceFile || 'the page'})`,
			)
		})
	})
}

test.describe('public site content security policy', () => {
	test('pages carry a policy that blocks plugins, framing and foreign forms', async ({ page }) => {
		const response = await page.goto('/')
		const policy = response?.headers()['content-security-policy'] ?? ''

		expect(policy).toContain("object-src 'none'")
		expect(policy).toContain("frame-ancestors 'none'")
		expect(policy).toContain("form-action 'self'")
		expect(policy).toContain("base-uri 'self'")
	})

	for (const path of PAGES) {
		test(`${path} renders without policy violations`, async ({ page }) => {
			await recordViolations(page)

			await page.goto(path)
			await expect(page.getByRole('main')).toBeVisible()
			await page.waitForLoadState('networkidle')

			expect(
				await page.evaluate(
					() => (window as unknown as { __cspViolations: string[] }).__cspViolations,
				),
			).toEqual([])
		})
	}
})
