import type { FetchResult } from 'types/api'
import type { PresignedUpload, UploadedMedia } from 'types/models'
import { getIdToken } from 'lib/firebase'
import { BASE_URL } from 'constants/base-url'

export const adminFetch = async <T>(
	endpoint: string,
	options: RequestInit = {},
): Promise<FetchResult<T>> => {
	const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
	const url = `${BASE_URL}${cleanEndpoint}`

	const headers: Record<string, string> = {
		Accept: 'application/json',
		// FormData bodies need the browser to set the multipart boundary itself.
		...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
		...((options.headers as Record<string, string>) || {}),
	}

	try {
		const token = await getIdToken()

		if (token) headers.Authorization = `Bearer ${token}`

		const res = await fetch(url, {
			...options,
			headers,
		})

		const statusCode = res.status

		const json = await res.json().catch(() => null)

		if (!res.ok) {
			return {
				data: null,
				error: json?.message || `HTTP ${res.status}: ${res.statusText}`,
				statusCode,
			}
		}

		// Unwrap the API's response envelope so callers receive the result directly.
		if (json && typeof json === 'object' && 'result' in json)
			return {
				data: json.result as T,
				error: null,
				count: json.count,
				statusCode: json.statusCode || statusCode,
			}

		return {
			data: json as T,
			error: null,
			statusCode,
		}
	} catch (err) {
		// A request cancelled by a newer one is not an error; callers ignore aborted results.
		if (options.signal?.aborted) return { data: null, error: null, aborted: true }

		return {
			data: null,
			error: err instanceof Error ? err.message : 'Network error connecting to backend API.',
			statusCode: 503,
		}
	}
}

// Three steps: the API issues a presigned URL, the browser uploads straight to S3, then the
// API checks the object exists and creates the media record.
export const uploadMediaToS3 = async (file: File, folder = 'general'): Promise<UploadedMedia> => {
	const mediaType = file.type.startsWith('image/')
		? 'IMAGE'
		: file.type.includes('pdf')
			? 'DOCUMENT'
			: file.type.startsWith('video/')
				? 'VIDEO'
				: file.type.startsWith('audio/')
					? 'AUDIO'
					: 'OTHER'

	const presignRes = await adminFetch<PresignedUpload>('/api/v1/media/presigned-url', {
		method: 'POST',
		body: JSON.stringify({
			originalName: file.name,
			mimeType: file.type,
			size: file.size,
			type: mediaType,
			folder,
		}),
	})

	if (!presignRes.data?.uploadUrl) {
		throw new Error(presignRes.error || 'Failed to generate S3 presigned upload URL from API.')
	}

	const { uploadUrl, storageKey } = presignRes.data

	// Content-Type must match the type the URL was signed for, or S3 rejects the upload.
	const s3Res = await fetch(uploadUrl, {
		method: 'PUT',
		headers: {
			'Content-Type': file.type,
		},
		body: file,
	}).catch(() => {
		throw new Error(
			'Upload to S3 was blocked before it started. Check that the bucket CORS rules allow PUT from this admin origin.',
		)
	})

	if (!s3Res.ok) {
		throw new Error(`Failed to upload to S3: HTTP ${s3Res.status}`)
	}

	const confirmRes = await adminFetch<UploadedMedia>('/api/v1/media/complete', {
		method: 'POST',
		body: JSON.stringify({
			storageKey,
			originalName: file.name,
			mimeType: file.type,
			size: file.size,
			type: mediaType,
			folder,
		}),
	})

	if (!confirmRes.data) {
		throw new Error(confirmRes.error || 'Failed to confirm media upload with backend.')
	}

	return confirmRes.data
}
