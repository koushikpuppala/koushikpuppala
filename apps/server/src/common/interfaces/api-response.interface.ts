export interface ApiResponse<T = unknown> {
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

export function successResponse<T>(
	result?: T,
	message = 'Operation successful.',
	count?: number,
): ApiResponse<T> {
	const response: ApiResponse<T> = { message }

	if (result !== undefined) response.result = result

	if (count !== undefined) response.count = count
	else if (Array.isArray(result)) response.count = result.length

	return response
}

export function errorResponse<T = undefined>(
	message = 'An error occurred.',
	result?: T,
): ApiResponse<T> {
	const response: ApiResponse<T> = { message, error: true }

	if (result !== undefined) response.result = result

	return response
}
