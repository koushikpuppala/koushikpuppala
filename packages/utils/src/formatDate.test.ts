import { describe, expect, it } from 'vitest'
import { formatDate } from './formatDate'

describe('formatDate', () => {
	it('formats Date objects and ISO strings the same way', () => {
		const date = new Date(2026, 0, 5)

		expect(formatDate(date)).toBe('Jan 05, 2026')
		expect(formatDate(date.toISOString())).toBe(formatDate(date))
	})

	it('treats date-only strings as local calendar days', () => {
		expect(formatDate('2026-10-04')).toBe('Oct 04, 2026')
	})

	it('honours the locale', () => {
		expect(formatDate(new Date(2026, 0, 5), 'en-GB')).toBe('05 Jan 2026')
	})
})
