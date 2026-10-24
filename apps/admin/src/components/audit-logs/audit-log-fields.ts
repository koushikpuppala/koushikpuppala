import type { DisplayValue, FieldRow } from 'types/components/admin'

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null && !Array.isArray(value)

export const fieldLabel = (key: string) => {
	const words = key
		.replace(/[_-]+/g, ' ')
		.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
		.trim()
		.toLowerCase()

	return words.charAt(0).toUpperCase() + words.slice(1)
}

const isBlank = (value: unknown) =>
	value === null ||
	value === undefined ||
	value === '' ||
	(Array.isArray(value) && value.length === 0)

// null, undefined, '' and [] all count as empty, so switching between them is not shown as a change.
const same = (a: unknown, b: unknown) =>
	(isBlank(a) && isBlank(b)) || JSON.stringify(a) === JSON.stringify(b)

export const changedFields = (before: unknown, after: unknown): FieldRow[] => {
	const old = isRecord(before) ? before : {}
	const next = isRecord(after) ? after : {}
	const keys = [...new Set([...Object.keys(old), ...Object.keys(next)])]

	return keys
		.filter(key => !same(old[key], next[key]))
		.map(key => ({ key, label: fieldLabel(key), before: old[key], after: next[key] }))
}

export const recordFields = (record: unknown, side: 'before' | 'after'): FieldRow[] =>
	isRecord(record)
		? Object.entries(record).map(([key, value]) => ({ key, label: fieldLabel(key), [side]: value }))
		: []

// Audit data is stored as JSON, so dates come back as ISO strings.
const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/

export const displayValue = (value: unknown): DisplayValue => {
	if (value === null || value === undefined || value === '') return { kind: 'empty' }
	if (typeof value === 'boolean') return { kind: 'text', text: value ? 'Yes' : 'No' }
	if (typeof value === 'number') return { kind: 'text', text: String(value), mono: true }
	if (typeof value === 'string') {
		if (ISO_DATE.test(value) && !Number.isNaN(Date.parse(value)))
			return { kind: 'text', text: new Date(value).toLocaleString(), mono: true }

		return { kind: 'text', text: value }
	}
	if (Array.isArray(value) && value.every(item => typeof item !== 'object' || item === null)) {
		return value.length ? { kind: 'text', text: value.join(', ') } : { kind: 'empty' }
	}

	return { kind: 'json', text: JSON.stringify(value, null, 2) }
}
