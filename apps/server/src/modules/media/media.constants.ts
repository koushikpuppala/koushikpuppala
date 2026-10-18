import type { AllowedUpload } from 'types/server'

import { MediaType } from '@repo/prisma'

export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024

export const ALLOWED_UPLOADS: Record<string, AllowedUpload> = {
	'image/jpeg': { extensions: ['.jpg', '.jpeg'], type: MediaType.IMAGE },
	'image/png': { extensions: ['.png'], type: MediaType.IMAGE },
	'image/webp': { extensions: ['.webp'], type: MediaType.IMAGE },
	'image/avif': { extensions: ['.avif'], type: MediaType.IMAGE },
	'image/gif': { extensions: ['.gif'], type: MediaType.IMAGE },
	'application/pdf': { extensions: ['.pdf'], type: MediaType.DOCUMENT },
	'video/mp4': { extensions: ['.mp4'], type: MediaType.VIDEO },
	'video/webm': { extensions: ['.webm'], type: MediaType.VIDEO },
	'audio/mpeg': { extensions: ['.mp3'], type: MediaType.AUDIO },
	'audio/ogg': { extensions: ['.ogg', '.oga'], type: MediaType.AUDIO },
}

// Matches keys built by MediaService.requestPresignedUpload: '<folder>/<uuid>.<extension>'.
export const STORAGE_KEY_PATTERN =
	/^[a-zA-Z0-9_\-/]+\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.[a-z0-9]+$/
