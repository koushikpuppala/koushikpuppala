import { describe, expect, it } from 'vitest'
import { formatRelativeTime } from './formatRelativeTime'

const NOW = new Date('2026-11-02T12:00:00.000Z')

describe('formatRelativeTime', () => {
	it('says just now under a minute', () => {
		expect(formatRelativeTime('2026-11-02T11:59:30.000Z', NOW)).toBe('just now')
	})

	it('uses the largest whole unit', () => {
		expect(formatRelativeTime('2026-11-02T11:55:00.000Z', NOW)).toBe('5 minutes ago')
		expect(formatRelativeTime('2026-11-02T09:00:00.000Z', NOW)).toBe('3 hours ago')
		expect(formatRelativeTime('2026-11-01T12:00:00.000Z', NOW)).toBe('yesterday')
		expect(formatRelativeTime('2026-09-02T12:00:00.000Z', NOW)).toBe('2 months ago')
	})
})
