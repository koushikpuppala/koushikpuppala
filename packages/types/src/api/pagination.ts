export type SortOrder = 'asc' | 'desc'

export type PaginationMeta = {
	page: number
	limit: number
	total: number
	totalPages: number
}

export type PaginatedList<T> = {
	items: T[]
	pagination: PaginationMeta
}

export type ListPage<T> = Partial<PaginatedList<T>>

export type ListResult<T> = ListPage<T> | T[]

export type ContactListCounts = {
	unreadCount: number
	urgentCount: number
	resolvedCount: number
}

export type UserListCounts = {
	adminCount: number
	editorCount: number
	activeCount: number
}

export type ContactListResult<T> = ListResult<T> & Partial<ContactListCounts>
export type UserListResult<T> = ListResult<T> & Partial<UserListCounts>

export type PublishedProjectQuery = { category?: string; featured?: boolean }
