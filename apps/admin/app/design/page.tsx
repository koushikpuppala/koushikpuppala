import type { Metadata } from 'next'
import { DesignSystemView } from 'components/design/design-system-view'

export const metadata: Metadata = {
	title: 'Design tokens',
	description: 'Reference for the admin design tokens.',
}

const DesignPage = () => {
	return <DesignSystemView />
}

export default DesignPage
