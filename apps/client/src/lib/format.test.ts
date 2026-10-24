import { describe, expect, it } from 'vitest'
import { durationLabel } from 'lib/format'

describe('durationLabel', () => {
	it('counts a current role up to today, not a fixed date', () => {
		const now = new Date('2026-10-11T12:00:00Z')

		expect(durationLabel('2024-10-01T00:00:00.000Z', null, now)).toBe('2 yr')
	})

	it('only counts a month once the day of the month is reached', () => {
		expect(durationLabel('2024-10-15T00:00:00Z', null, new Date('2026-10-11T00:00:00Z'))).toBe(
			'1 yr 11 mo',
		)
		expect(durationLabel('2024-10-15T00:00:00Z', null, new Date('2026-10-15T00:00:00Z'))).toBe(
			'2 yr',
		)
	})

	it('shows at least one month for a role that just started', () => {
		expect(durationLabel('2026-10-01T00:00:00Z', null, new Date('2026-10-11T00:00:00Z'))).toBe(
			'1 mo',
		)
	})

	it('counts both end months for an ended role', () => {
		expect(durationLabel('2023-01-01T00:00:00Z', '2023-12-31T00:00:00Z')).toBe('1 yr')
		expect(durationLabel('2022-06-01T00:00:00Z', '2023-08-31T00:00:00Z')).toBe('1 yr 3 mo')
	})

	it('shows nothing for a current role until the date is known', () => {
		expect(durationLabel('2024-10-01T00:00:00Z', null)).toBe('')
		expect(durationLabel('2024-10-01T00:00:00Z', null, null)).toBe('')
	})

	it('shows nothing for an invalid start date', () => {
		expect(durationLabel('not a date', null, new Date())).toBe('')
	})
})
