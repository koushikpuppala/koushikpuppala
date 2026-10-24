import { describe, expect, it } from 'vitest'
import { createdAtRange } from './date-range.util'

describe('createdAtRange', () => {
	it('returns no filter when neither date is given', () => {
		expect(createdAtRange()).toBeUndefined()
		expect(createdAtRange('', '')).toBeUndefined()
	})

	it('covers both days in full', () => {
		const range = createdAtRange('2026-10-04', '2026-10-09')

		expect(range?.gte?.toISOString()).toBe('2026-10-04T00:00:00.000Z')
		expect(range?.lte?.toISOString()).toBe('2026-10-09T23:59:59.999Z')
	})

	it('uses exact timestamps as given', () => {
		const range = createdAtRange('2026-10-03T18:30:00.000Z', '2026-10-04T18:29:59.999Z')

		expect(range?.gte?.toISOString()).toBe('2026-10-03T18:30:00.000Z')
		expect(range?.lte?.toISOString()).toBe('2026-10-04T18:29:59.999Z')
	})

	it('filters on one side only when only one date is given', () => {
		expect(createdAtRange('2026-10-04')).toEqual({ gte: expect.any(Date) })
		expect(createdAtRange(undefined, '2026-10-09')).toEqual({ lte: expect.any(Date) })
	})
})
