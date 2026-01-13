import { z } from 'zod'

export const HomeFormValidation = z.object({
	title: z
		.string()
		.nonempty({ error: 'Title is required' })
		.min(3, { error: 'Title must be at least 3 characters long' })
		.max(20, { error: 'Title must be at most 20 characters long' }),
	separator: z
		.string()
		.nonempty({ error: 'Separator is required' })
		.length(1, { error: 'Separator must be exactly 1 character long' }),
	subtitles: z.array(
		z
			.string()
			.nonempty({ error: 'Subtitle cannot be empty' })
			.min(3, { error: 'Subtitle must be at least 3 characters long' })
			.max(20, { error: 'Subtitle must be at most 20 characters long' })
	),
	content: z
		.string()
		.nonempty({ error: 'Content is required' })
		.min(100, { error: 'Content must be at least 100 characters long' })
		.max(500, { error: 'Content must be at most 500 characters long' }),
})
