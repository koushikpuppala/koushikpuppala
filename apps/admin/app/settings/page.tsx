import type { Metadata } from 'next'
import { SettingsView } from 'components/settings/settings-view'

export const metadata: Metadata = {
	title: 'Studio Settings',
	description: 'Manage metadata presets, route configurations, API endpoints, and system settings.',
}

const SettingsPage = () => {
	return <SettingsView />
}

export default SettingsPage
