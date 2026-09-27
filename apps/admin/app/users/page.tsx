import type { Metadata } from 'next'
import { UsersClientView } from '@/components/views/users-client-view'

export const metadata: Metadata = {
	title: 'User Management',
	description: 'Manage studio administrators, roles, permissions, and active sessions.',
}

export const UsersPage = () => {
	return <UsersClientView />
}

export default UsersPage
