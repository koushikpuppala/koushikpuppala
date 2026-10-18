import type { Metadata } from 'next'
import { MessagesView } from 'components/messages/messages-view'

export const metadata: Metadata = {
	title: 'Contact Messages',
	description: 'Review, filter, and manage inbound contact inquiries and visitor messages.',
}

const MessagesPage = () => {
	return <MessagesView />
}

export default MessagesPage
