import { expect, test } from '@playwright/test'
import { USERS } from '../../env'
import { signIn } from '../../fixtures/admin'

test.describe('studio sign in', () => {
	test('an editor signs in and reaches the studio', async ({ page }) => {
		await signIn(page, USERS.editor)

		await expect(page.getByRole('link', { name: 'Projects & Work' })).toBeVisible()
	})

	test('a plain USER account is refused', async ({ page }) => {
		await page.goto('/login')
		await page.getByLabel(/email address/i).fill(USERS.user.email)
		await page.getByLabel(/password/i).fill(USERS.user.password)
		await page.getByRole('button', { name: /sign in with credentials/i }).click()

		await expect(page.getByRole('alert').filter({ hasText: 'does not have access' })).toBeVisible()
		await expect(page).toHaveURL(/\/login/)
	})

	test('a wrong password is refused', async ({ page }) => {
		await page.goto('/login')
		await page.getByLabel(/email address/i).fill(USERS.editor.email)
		await page.getByLabel(/password/i).fill('wrong-password')
		await page.getByRole('button', { name: /sign in with credentials/i }).click()

		await expect(page.getByRole('alert').filter({ hasText: /\S/ })).toBeVisible()
	})

	test('signed out visitors are sent to the login page', async ({ page }) => {
		await page.goto('/content/projects')

		await expect(page).toHaveURL(/\/login/)
	})
})
