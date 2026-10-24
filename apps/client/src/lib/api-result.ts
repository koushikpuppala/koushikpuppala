import type { ApiResponse } from 'types/api'

export const unwrap = <T>({ result, error, message }: ApiResponse<T>, label: string): T | null => {
	if (error) console.error(`[${label}] API request failed:`, message)

	return error || !result ? null : result
}
