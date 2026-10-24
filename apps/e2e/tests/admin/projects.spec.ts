import { expect, test } from '@playwright/test'
import { CLIENT_URL, CONTENT } from '../../env'
import { prisma } from '../../fixtures/db'
import { signIn } from '../../fixtures/admin'

test.describe('projects in the studio', () => {
	test.afterAll(() => prisma.$disconnect())

	test.beforeEach(async ({ page }) => {
		await signIn(page)
		await page.goto('/content/projects')
	})

	test('editing only the title keeps the rest, and the public site updates right away', async ({
		page,
		browser,
	}) => {
		const row = page.getByRole('row').filter({ hasText: 'Round Trip Project' })
		await row.getByRole('button', { name: 'Edit' }).click()

		const dialog = page.getByRole('dialog')
		await dialog.getByLabel('Title', { exact: true }).fill('Round Trip Project (edited)')
		await dialog.getByRole('button', { name: 'Save Project' }).click()
		await expect(dialog).toBeHidden()

		const saved = await prisma.project.findUniqueOrThrow({ where: { slug: 'round-trip' } })
		expect(saved).toMatchObject({
			title: 'Round Trip Project (edited)',
			isPublished: true,
			tags: ['fintech', 'e2e'],
		})

		const visitor = await browser.newPage()
		await expect(async () => {
			await visitor.goto(`${CLIENT_URL}/projects/round-trip`)
			await expect(
				visitor.getByRole('heading', { name: 'Round Trip Project (edited)' }),
			).toBeVisible({
				timeout: 2_000,
			})
		}).toPass({ timeout: 20_000 })
		await visitor.close()
	})

	test('a save error is shown inside the dialog, which stays open', async ({ page }) => {
		await page.getByRole('button', { name: 'New Project' }).click()

		const dialog = page.getByRole('dialog')
		await dialog.getByLabel('Title', { exact: true }).fill('Duplicate')
		await dialog.getByLabel('Slug').fill(CONTENT.publishedProject.slug)
		await dialog.getByLabel('Subtitle').fill('Subtitle')
		await dialog.getByLabel('Category').fill('Backend')
		await dialog.getByRole('button', { name: 'Save Project' }).click()

		await expect(dialog.getByRole('alert')).toContainText('already exists')
		await expect(dialog).toBeVisible()
		await expect(dialog.getByLabel('Title', { exact: true })).toHaveValue('Duplicate')
	})
})
