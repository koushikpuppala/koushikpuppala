import type { ApiResponseDto } from 'types/api'

/**
 * Returns the base API URL for server or client side data fetching.
 * Inspects environment variables in prioritized order:
 * 1. INTERNAL_API_URL / BACKEND_INTERNAL_URL (SSR container-to-container)
 * 2. NEXT_PUBLIC_DEPLOY_URL / API_URL (Public deployment endpoint)
 * 3. Default local development fallback (http://localhost:5000)
 */
export function getApiBaseUrl(): string {
	const raw =
		process.env.INTERNAL_API_URL ||
		process.env.BACKEND_INTERNAL_URL ||
		process.env.API_URL ||
		process.env.NEXT_PUBLIC_API_URL ||
		process.env.NEXT_PUBLIC_DEPLOY_URL ||
		(process.env.NODE_ENV === 'production'
			? 'https://api.koushikpuppala.com'
			: 'http://localhost:5000')

	return raw.replace(/\/+$/, '')
}

export type FetchApiResult<T> = {
	data: T | null
	error: Error | null
	count?: number
	statusCode?: number
}

/**
 * Centralized, typed API client for apps/client.
 * - Resolves the base backend URL
 * - Appends endpoint path (handles leading slashes cleanly)
 * - Sets default headers and Next.js 16 revalidation (default 60s)
 * - Automatically unwraps NestJS ResponseInterceptor envelopes ({ statusCode, message, result: T, count })
 * - Returns structured { data, error, count, statusCode } without throwing unhandled exceptions
 * - Supports resilient fallback during static site generation when the backend is offline
 */
export async function fetchApi<T>(
	endpoint: string,
	options?: RequestInit,
): Promise<FetchApiResult<T>> {
	const baseUrl = getApiBaseUrl()
	const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
	const url = `${baseUrl}${cleanEndpoint}`

	try {
		const res = await fetch(url, {
			headers: {
				Accept: 'application/json',
				...(options?.headers || {}),
			},
			next: { revalidate: 60 },
			...options,
		})

		const statusCode = res.status

		if (!res.ok) {
			return {
				data: null,
				error: new Error(`HTTP ${res.status}: ${res.statusText}`),
				statusCode,
			}
		}

		const json = (await res.json()) as ApiResponseDto<T> | T

		// Handle NestJS ResponseInterceptor wrapper
		if (json && typeof json === 'object' && 'result' in json) {
			const wrapped = json as ApiResponseDto<T>
			return {
				data: (wrapped.result !== undefined ? wrapped.result : null) as T,
				error: null,
				count: wrapped.count,
				statusCode: wrapped.statusCode || statusCode,
			}
		}

		return {
			data: json as T,
			error: null,
			statusCode,
		}
	} catch (err) {
		// During static generation or offline environments, network requests may fail (e.g. ECONNREFUSED)
		return {
			data: null,
			error: err instanceof Error ? err : new Error(String(err)),
		}
	}
}
