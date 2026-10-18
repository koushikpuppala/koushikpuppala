import { expect, type Page, test } from '@playwright/test'
import { prisma } from '../../fixtures/db'

const fillForm = async (page: Page, email: string) => {
	await page.getByLabel(/your name/i).fill('Grace Hopper')
	await page.getByLabel(/your email/i).fill(email)
	await page.getByLabel(/subject/i).fill('Speaking invitation')
	await page.getByLabel(/message/i).fill('Would you speak at our engineering meetup next month?')
}

test.describe('contact form', () => {
	test.afterAll(() => prisma.$disconnect())

	test('the browser blocks an empty submission', async ({ page }) => {
		await page.goto('/contact')

		await page.getByRole('button', { name: 'Send Message' }).click()

		const missing = (label: RegExp) =>
			page.getByLabel(label).evaluate(field => (field as HTMLInputElement).validity.valueMissing)
		expect(await missing(/your name/i)).toBe(true)
		expect(await missing(/your email/i)).toBe(true)
	})

	test('explains when a message is sent too quickly', async ({ page }) => {
		await page.goto('/contact')
		await fillForm(page, 'too-fast@e2e.test')
		await page.getByRole('button', { name: 'Send Message' }).click()

		await expect(page.getByRole('alert').filter({ hasText: 'take a moment' })).toBeVisible()
	})

	test('delivers a valid message to the inbox', async ({ page }, testInfo) => {
		const email = `visitor-${testInfo.project.name}@e2e.test`
		await page.clock.install()
		await page.goto('/contact')
		await fillForm(page, email)
		await page.clock.fastForward(3_000)
		await page.getByRole('button', { name: 'Send Message' }).click()

		await expect(page.getByRole('heading', { name: 'Message Dispatched!' })).toBeVisible()
		await expect.poll(() => prisma.contact.count({ where: { email } })).toBe(1)
	})
})
