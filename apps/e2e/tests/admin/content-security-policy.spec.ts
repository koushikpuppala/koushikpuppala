import { expect, test, type Page } from '@playwright/test'
import { USERS } from '../../env'
import { signIn } from '../../fixtures/admin'

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

const violations = (page: Page) =>
	page.evaluate(() => (window as unknown as { __cspViolations: string[] }).__cspViolations)

test.describe('studio content security policy', () => {
	test('every page gets a fresh nonce policy that only trusts nonced scripts', async ({ page }) => {
		const first = await page.goto('/login')
		const second = await page.request.get('/login')

		const policy = first?.headers()['content-security-policy'] ?? ''
		const nonce = /'nonce-([^']+)'/.exec(policy)?.[1]

		expect(policy).toContain("'strict-dynamic'")
		expect(policy).toContain("object-src 'none'")
		expect(policy).toContain("frame-ancestors 'none'")
		expect(policy).not.toContain("'unsafe-inline' 'strict-dynamic'")
		expect(nonce).toBeTruthy()
		expect(second.headers()['content-security-policy']).not.toContain(`'nonce-${nonce}'`)
	})

	test('signing in and opening the editors breaks nothing under the policy', async ({ page }) => {
		await recordViolations(page)

		await signIn(page)
		expect(await violations(page)).toEqual([])

		// Each page load starts a new record, so every page is checked once it has rendered.
		for (const path of ['/content/projects', '/media', '/settings']) {
			await page.goto(path)
			await expect(page.getByRole('main')).toBeVisible()
			expect(await violations(page), path).toEqual([])
		}
	})

	test('form validation runs under the policy', async ({ page }) => {
		await recordViolations(page)

		await signIn(page, USERS.admin)
		await page.goto('/users')
		await page.getByRole('button', { name: /add personnel/i }).click()

		// Zod parses on blur; with its eval probe left on, the policy would report it here.
		await page.getByLabel('Full Name').fill('A')
		await page.keyboard.press('Tab')

		await expect(page.getByText('Full name is required')).toBeVisible()
		expect(await violations(page)).toEqual([])
	})
})
