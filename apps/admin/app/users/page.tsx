import type { Metadata } from 'next'
import { UsersView } from 'components/users/users-view'

export const metadata: Metadata = {
	title: 'User Management',
	description: 'Manage studio administrators, roles, permissions, and active sessions.',
}

const UsersPage = () => {
	return <UsersView />
}

export default UsersPage
