import type { Metadata } from 'next'
import { LoginClientView } from '@/components/views/login-client-view'

export const metadata: Metadata = {
	title: 'Sign In',
	description: 'Sign in to access the Koushik Puppala administrative content studio.',
}

export const LoginPage = () => {
	return <LoginClientView />
}

export default LoginPage
