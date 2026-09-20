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
