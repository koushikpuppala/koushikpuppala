import userEvent from '@testing-library/user-event'
import { LoginView } from './login-view'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const login = vi.fn()
const loginWithGoogle = vi.fn()
vi.mock('lib/auth', () => ({ useAuth: () => ({ login, loginWithGoogle, loading: false }) }))

describe('LoginView', () => {
	beforeEach(() => vi.clearAllMocks())

	it('signs in with the typed credentials', async () => {
		login.mockResolvedValue(undefined)
		render(<LoginView />)

		await userEvent.click(screen.getByLabelText(/email address/i))
		await userEvent.paste('kp@example.com')
		await userEvent.click(screen.getByLabelText(/password/i))
		await userEvent.paste('secret')
		await userEvent.click(screen.getByRole('button', { name: /sign in with credentials/i }))

		expect(login).toHaveBeenCalledWith('kp@example.com', 'secret')
		expect(screen.queryByRole('alert')).not.toBeInTheDocument()
	})

	it('announces a credential sign in failure', async () => {
		login.mockRejectedValue(new Error('Your account does not have access to the Content Studio.'))
		render(<LoginView />)

		await userEvent.click(screen.getByLabelText(/email address/i))
		await userEvent.paste('user@example.com')
		await userEvent.click(screen.getByLabelText(/password/i))
		await userEvent.paste('secret')
		await userEvent.click(screen.getByRole('button', { name: /sign in with credentials/i }))

		expect(await screen.findByRole('alert')).toHaveTextContent('does not have access')
	})

	it('announces a Google sign in failure', async () => {
		loginWithGoogle.mockRejectedValue(new Error('Popup closed by user'))
		render(<LoginView />)

		await userEvent.click(screen.getByRole('button', { name: /sign in with google/i }))

		expect(await screen.findByRole('alert')).toHaveTextContent('Popup closed by user')
	})

	it('offers no demo or bypass login', () => {
		render(<LoginView />)

		expect(screen.queryByRole('button', { name: /demo|dev admin|local/i })).not.toBeInTheDocument()
	})
})
