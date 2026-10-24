export type ApiResponse<T = unknown> = {
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

export type FetchResult<T> = {
	data: T | null
	error: string | null
	count?: number
	statusCode?: number
	aborted?: boolean
}
