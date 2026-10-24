import type { PublishFields } from 'types/server'

// Keeps the original publish date when re-saving published content, and clears it when unpublishing.
export const publishFields = (isPublished: boolean, publishedAt?: Date | null): PublishFields => ({
	isPublished,
	publishedAt: isPublished ? (publishedAt ?? new Date()) : null,
})

export const publishUpdate = (
	isPublished: boolean | undefined,
	publishedAt?: Date | null,
): Partial<PublishFields> =>
	isPublished === undefined ? {} : publishFields(isPublished, publishedAt)
