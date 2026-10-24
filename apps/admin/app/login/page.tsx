import type { Metadata } from 'next'
import { LoginView } from 'components/auth/login-view'

export const metadata: Metadata = {
	title: 'Sign In',
	description: 'Sign in to access the Koushik Puppala administrative content studio.',
}

const LoginPage = () => {
	return <LoginView />
}

export default LoginPage
