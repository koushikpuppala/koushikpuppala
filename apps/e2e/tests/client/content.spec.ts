import { expect, test } from '@playwright/test'
import { CONTENT } from '../../env'

test.describe('public portfolio content', () => {
	test('home shows the published home content and featured project', async ({ page }) => {
		const errors: string[] = []
		page.on('pageerror', error => errors.push(error.message))

		await page.goto('/')

		await expect(page.getByRole('heading', { name: CONTENT.homeTitle, level: 1 })).toBeVisible()
		await expect(
			page.getByText(CONTENT.publishedProject.title).filter({ visible: true }).first(),
		).toBeVisible()
		expect(errors).toEqual([])
	})

	test('projects list shows published projects only', async ({ page }) => {
		await page.goto('/projects')

		await expect(
			page.getByText(CONTENT.publishedProject.title).filter({ visible: true }).first(),
		).toBeVisible()
		await expect(page.getByText(CONTENT.draftProject.title)).toHaveCount(0)
	})

	test('a published project has its own page', async ({ page }) => {
		const response = await page.goto(`/projects/${CONTENT.publishedProject.slug}`)

		expect(response?.status()).toBe(200)
		await expect(page.getByRole('heading', { name: CONTENT.publishedProject.title })).toBeVisible()
	})

	test('an unpublished project is not found and not indexed', async ({ page }) => {
		await page.goto(`/projects/${CONTENT.draftProject.slug}`)

		await expect(page.getByRole('main').getByText(/not found/i)).toBeVisible()
		await expect(page.getByText(CONTENT.draftProject.title)).toHaveCount(0)
		await expect(page.locator('meta[name="robots"][content*="noindex"]').first()).toBeAttached()
	})
})
