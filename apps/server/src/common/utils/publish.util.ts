import type { PublishFields } from 'types/server'

export const publishFields = (isPublished: boolean, publishedAt?: Date | null): PublishFields => ({
	isPublished,
	publishedAt: isPublished ? (publishedAt ?? new Date()) : null,
})

export const publishUpdate = (
	isPublished: boolean | undefined,
	publishedAt?: Date | null,
): Partial<PublishFields> =>
	isPublished === undefined ? {} : publishFields(isPublished, publishedAt)
