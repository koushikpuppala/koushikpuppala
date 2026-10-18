import { expect, test } from '@playwright/test'
import { CONTENT, USERS } from '../../env'
import { signIn } from '../../fixtures/admin'

test('deleting media that a project uses is refused with the reason', async ({ page }) => {
	await signIn(page)
	await page.goto('/media')

	const card = page.locator('.group').filter({ hasText: CONTENT.thumbnailMediaName })
	await card.hover()
	await card.getByTitle('Delete asset').click()

	const dialog = page.getByRole('alertdialog')
	await dialog.getByRole('button', { name: 'Delete Asset' }).click()

	await expect(dialog.getByRole('alert')).toContainText('still in use')
	await expect(dialog).toBeVisible()
})

test('an admin cannot demote their own account', async ({ page }) => {
	await signIn(page, USERS.admin)
	await page.goto('/users')

	await page.getByRole('button', { name: `Edit ${USERS.admin.email}` }).click()

	const dialog = page.getByRole('dialog')
	await dialog.getByRole('button', { name: 'Edit user role' }).click()
	await page.getByRole('option', { name: /^EDITOR/ }).click()
	await dialog.getByRole('button', { name: 'Save Permissions' }).click()

	await expect(dialog.getByRole('alert')).toContainText(/cannot demote their own/i)
	await expect(dialog).toBeVisible()
})
