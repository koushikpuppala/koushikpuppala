export interface PaginationMeta {
	page: number
	limit: number
	total: number
	totalPages: number
}

export interface PaginatedResponse<T> {
	data: T[]
	pagination: PaginationMeta
}
