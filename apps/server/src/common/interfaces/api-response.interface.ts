import type { ApiResponse } from 'types'

export type { ApiResponse }

export const successResponse = <T>(
	result?: T,
	message = 'Operation successful.',
	count?: number,
): ApiResponse<T> => {
	const response: ApiResponse<T> = { message }

	if (result !== undefined) response.result = result

	if (count !== undefined) response.count = count
	else if (Array.isArray(result)) response.count = result.length

	return response
}
