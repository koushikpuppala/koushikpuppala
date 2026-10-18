import { describe, expect, it } from 'vitest'
import { createdAtRange } from './date-range.util'

describe('createdAtRange', () => {
	it('returns no filter when neither date is given', () => {
		expect(createdAtRange()).toBeUndefined()
		expect(createdAtRange('', '')).toBeUndefined()
	})

	it('covers both days in full', () => {
		const range = createdAtRange('2026-10-04', '2026-10-09')

		expect(range?.gte?.getHours()).toBe(0)
		expect(range?.gte?.getDate()).toBe(4)
		expect(range?.lte?.getHours()).toBe(23)
		expect(range?.lte?.getDate()).toBe(9)
	})

	it('filters on one side only when only one date is given', () => {
		expect(createdAtRange('2026-10-04')).toEqual({ gte: expect.any(Date) })
		expect(createdAtRange(undefined, '2026-10-09')).toEqual({ lte: expect.any(Date) })
	})
})
