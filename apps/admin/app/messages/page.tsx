import type { Metadata } from 'next'
import { MessagesClientView } from '@/components/views/messages-client-view'

export const metadata: Metadata = {
	title: 'Contact Messages',
	description: 'Review, filter, and manage inbound contact inquiries and visitor messages.',
}

export const MessagesPage = () => {
	return <MessagesClientView />
}

export default MessagesPage
