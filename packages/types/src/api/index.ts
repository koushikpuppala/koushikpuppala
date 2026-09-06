export type ApiResponseDto<T = unknown> = {
	result?: T
	message: string
	error?: boolean
	count?: number
	statusCode?: number
	ip?: string
	requestId?: string
	timestamp?: string
	endpoint?: string
}

export type PaginationMetaDto = {
	page: number
	limit: number
	total: number
	totalPages: number
}

export type PaginatedResultDto<T> = {
	items: T[]
	pagination: PaginationMetaDto
}

export type BaseQueryDto = {
	page?: number
	limit?: number
	search?: string
	sortBy?: string
	sortOrder?: 'asc' | 'desc'
}
