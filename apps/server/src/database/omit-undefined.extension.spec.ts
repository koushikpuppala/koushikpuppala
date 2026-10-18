import { Prisma } from '@repo/prisma'
import { describe, expect, it } from 'vitest'
import { stripUndefined } from './omit-undefined.extension'

describe('stripUndefined', () => {
	it('drops undefined values at any depth, including nested writes', () => {
		expect(
			stripUndefined({
				title: 'T',
				url: undefined,
				gallery: { create: [{ mediaId: 'm1', caption: undefined }] },
			}),
		).toEqual({ title: 'T', gallery: { create: [{ mediaId: 'm1' }] } })
	})

	it('keeps null, false, 0 and empty strings, which are real values', () => {
		expect(stripUndefined({ endDate: null, featured: false, sortOrder: 0, caption: '' })).toEqual({
			endDate: null,
			featured: false,
			sortOrder: 0,
			caption: '',
		})
	})

	it('passes Dates and Prisma.skip through untouched', () => {
		const date = new Date('2026-01-01')
		const result = stripUndefined({ publishedAt: date, title: Prisma.skip }) as Record<
			string,
			unknown
		>

		expect(result.publishedAt).toBe(date)
		expect(result.title).toBe(Prisma.skip)
	})
})
