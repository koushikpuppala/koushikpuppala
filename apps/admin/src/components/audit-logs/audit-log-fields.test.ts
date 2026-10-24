import { describe, expect, it } from 'vitest'
import { changedFields, displayValue, fieldLabel, recordFields } from './audit-log-fields'

describe('audit log fields', () => {
	it('labels keys in plain words', () => {
		expect(fieldLabel('readAt')).toBe('Read at')
		expect(fieldLabel('seo_title')).toBe('Seo title')
		expect(fieldLabel('status')).toBe('Status')
	})

	it('lists only the fields an update changed', () => {
		const before = { id: '1', status: 'NEW', tags: ['a'], readAt: null }
		const after = { id: '1', status: 'READ', tags: ['a'], readAt: '2026-10-17T16:41:00.000Z' }

		expect(changedFields(before, after)).toEqual([
			{ key: 'status', label: 'Status', before: 'NEW', after: 'READ' },
			{ key: 'readAt', label: 'Read at', before: null, after: '2026-10-17T16:41:00.000Z' },
		])
	})

	it('ignores moves between empty values', () => {
		expect(changedFields({ gallery: null, notes: '' }, { gallery: [], notes: null })).toEqual([])
	})

	it('treats a missing snapshot as an empty record', () => {
		expect(changedFields(null, { title: 'New' })).toEqual([
			{ key: 'title', label: 'Title', before: undefined, after: 'New' },
		])
		expect(recordFields(null, 'after')).toEqual([])
	})

	it('lists every field of a created record', () => {
		expect(recordFields({ title: 'A', sortOrder: 2 }, 'after')).toEqual([
			{ key: 'title', label: 'Title', after: 'A' },
			{ key: 'sortOrder', label: 'Sort order', after: 2 },
		])
	})

	it('formats values for reading', () => {
		expect(displayValue(null)).toEqual({ kind: 'empty' })
		expect(displayValue('')).toEqual({ kind: 'empty' })
		expect(displayValue(true)).toEqual({ kind: 'text', text: 'Yes' })
		expect(displayValue(['react', 'next'])).toEqual({ kind: 'text', text: 'react, next' })
		expect(displayValue({ a: 1 })).toEqual({ kind: 'json', text: '{\n  "a": 1\n}' })
		expect(displayValue('2026-10-17T16:41:00.000Z')).toMatchObject({ kind: 'text', mono: true })
	})
})
