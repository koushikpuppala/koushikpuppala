import { expect, type Page } from '@playwright/test'
import { USERS } from '../env'

export const signIn = async (
	page: Page,
	account: (typeof USERS)[keyof typeof USERS] = USERS.editor,
) => {
	await page.goto('/login')
	await page.getByLabel(/email address/i).fill(account.email)
	await page.getByLabel(/password/i).fill(account.password)
	await page.getByRole('button', { name: /sign in with credentials/i }).click()

	await expect(page).not.toHaveURL(/\/login/)
}
