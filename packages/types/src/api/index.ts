export interface ApiResponseDto<T = unknown> {
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

export interface PaginationMetaDto {
	page: number
	limit: number
	total: number
	totalPages: number
}

export interface PaginatedResultDto<T> {
	items: T[]
	pagination: PaginationMetaDto
}

export interface BaseQueryDto {
	page?: number
	limit?: number
	search?: string
	sortBy?: string
	sortOrder?: 'asc' | 'desc'
}
