import type { PublishState } from 'types/components/admin'

export const toPublishState = (published: boolean | null | undefined): PublishState =>
	published ? 'PUBLISHED' : 'DRAFT'
