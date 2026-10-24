import { InboxSkeleton } from 'components/skeletons'

const MessagesLoading = () => {
	return <InboxSkeleton label='messages' columns={6} />
}

export default MessagesLoading
