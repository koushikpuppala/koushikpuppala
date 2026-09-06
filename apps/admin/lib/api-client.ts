export function getApiBaseUrl(): string {
	const raw =
		process.env.INTERNAL_API_URL ||
		process.env.NEXT_PUBLIC_API_URL ||
		(process.env.NODE_ENV === 'production'
			? 'https://api.koushikpuppala.com'
			: 'http://localhost:5000')

	return raw.replace(/\/+$/, '')
}

export type AdminApiResponse<T> = {
	data: T | null
	error: string | null
	count?: number
	statusCode?: number
}

function getStoredToken(): string | null {
	if (typeof window === 'undefined') return null
	try {
		const session = localStorage.getItem('kp.admin.session')
		if (!session) return null
		return JSON.parse(session)?.token || null
	} catch {
		return null
	}
}

/**
 * Authoritative admin API fetch client with automatic Firebase Bearer token injection
 * and NestJS ResponseInterceptor unwrapping.
 */
export async function adminFetch<T>(
	endpoint: string,
	options: RequestInit = {},
): Promise<AdminApiResponse<T>> {
	const baseUrl = getApiBaseUrl()
	const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
	const url = `${baseUrl}${cleanEndpoint}`

	const token = getStoredToken()
	const headers: Record<string, string> = {
		Accept: 'application/json',
		...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
		...(token ? { Authorization: `Bearer ${token}` } : {}),
		...((options.headers as Record<string, string>) || {}),
	}

	try {
		const res = await fetch(url, {
			...options,
			headers,
		})

		const statusCode = res.status

		if (statusCode === 401 && typeof window !== 'undefined') {
			// Token expired or invalid
			// router can redirect to /login
		}

		const json = await res.json().catch(() => null)

		if (!res.ok) {
			return {
				data: null,
				error: json?.message || `HTTP ${res.status}: ${res.statusText}`,
				statusCode,
			}
		}

		// Unwrap NestJS ApiResponseDto
		if (json && typeof json === 'object' && 'result' in json) {
			return {
				data: json.result as T,
				error: null,
				count: json.count,
				statusCode: json.statusCode || statusCode,
			}
		}

		return {
			data: json as T,
			error: null,
			statusCode,
		}
	} catch (err) {
		return {
			data: null,
			error: err instanceof Error ? err.message : 'Network error connecting to backend API.',
			statusCode: 503,
		}
	}
}

/**
 * S3 Direct Upload Pipeline
 * 1. Requests secure PUT presigned URL from backend
 * 2. Uploads binary directly to S3
 * 3. Confirms upload with backend to create Media record
 */
export async function uploadMediaToS3(file: File): Promise<{
	id: string
	url: string
	storageKey: string
	fileName: string
}> {
	// Step 1: Request presigned upload URL
	const mediaType = file.type.startsWith('image/')
		? 'IMAGE'
		: file.type.includes('pdf')
			? 'DOCUMENT'
			: file.type.startsWith('video/')
				? 'VIDEO'
				: file.type.startsWith('audio/')
					? 'AUDIO'
					: 'OTHER'

	const presignRes = await adminFetch<{
		uploadUrl: string
		storageKey: string
		url: string
	}>('/api/v1/media/presigned-url', {
		method: 'POST',
		body: JSON.stringify({
			originalName: file.name,
			mimeType: file.type,
			size: file.size,
			type: mediaType,
			folder: 'general',
		}),
	})

	if (!presignRes.data?.uploadUrl) {
		// Fallback for local demo when S3 credentials aren't set
		const localUrl = URL.createObjectURL(file)
		return {
			id: `media-${Date.now()}`,
			url: localUrl,
			storageKey: `uploads/${file.name}`,
			fileName: file.name,
		}
	}

	const { uploadUrl, storageKey } = presignRes.data

	// Step 2: Upload directly to S3 via HTTP PUT
	const s3Res = await fetch(uploadUrl, {
		method: 'PUT',
		headers: {
			'Content-Type': file.type,
		},
		body: file,
	})

	if (!s3Res.ok) {
		throw new Error(`Failed to upload to S3: HTTP ${s3Res.status}`)
	}

	// Step 3: Confirm with backend to persist Media record in PostgreSQL
	const confirmRes = await adminFetch<{
		id: string
		url: string
		storageKey: string
		fileName: string
	}>('/api/v1/media/complete', {
		method: 'POST',
		body: JSON.stringify({
			storageKey,
			originalName: file.name,
			mimeType: file.type,
			size: file.size,
			type: mediaType,
			folder: 'general',
		}),
	})

	if (!confirmRes.data) {
		throw new Error(confirmRes.error || 'Failed to confirm media upload with backend.')
	}

	return confirmRes.data
}
