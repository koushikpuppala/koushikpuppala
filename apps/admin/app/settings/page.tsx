import type { Metadata } from 'next'
import { SettingsClientView } from '@/components/views/settings-client-view'

export const metadata: Metadata = {
	title: 'Studio Settings',
	description: 'Manage metadata presets, route configurations, API endpoints, and system settings.',
}

export const SettingsPage = () => {
	return <SettingsClientView />
}

export default SettingsPage
