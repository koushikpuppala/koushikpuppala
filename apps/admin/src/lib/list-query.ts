import type { ListQueryOptions, ReadableParams } from 'types/components/admin'
export const publishFilter = (value: string): [string, string] => [
	'isPublished',
	String(value === 'PUBLISHED'),
]

// The date pickers hold a calendar day; the API gets that day's start or end in the viewer's own timezone,
// so filtering in India covers the IST day rather than the UTC one.
const toDayBound = (key: string, value: string): string => {
	if ((key !== 'from' && key !== 'to') || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return value

	const [year, month, day] = value.split('-').map(Number) as [number, number, number]

	return (
		key === 'from'
			? new Date(year, month - 1, day)
			: new Date(year, month - 1, day, 23, 59, 59, 999)
	).toISOString()
}

// Translates the DataTable's URL parameters into the API's query format: pageSize becomes limit,
// column ids map to API sort fields, and filters map to their API parameters.
export const toListQuery = (
	params: ReadableParams,
	{ sort = {}, filters = {} }: ListQueryOptions = {},
): URLSearchParams => {
	const query = new URLSearchParams()

	for (const key of ['page', 'search', 'from', 'to']) {
		const value = params.get(key)

		if (value) query.set(key, toDayBound(key, value))
	}

	const pageSize = params.get('pageSize')
	if (pageSize) query.set('limit', pageSize)

	const sortBy = params.get('sortBy')
	if (sortBy) {
		query.set('sortBy', sort[sortBy] ?? sortBy)
		query.set('sortOrder', params.get('order') === 'desc' ? 'desc' : 'asc')
	}

	for (const [id, target] of Object.entries(filters)) {
		const value = params.get(id)

		if (!value) continue

		if (typeof target === 'string') query.set(target, value)
		else query.set(...target(value))
	}

	return query
}

// For tables that always ask for their own page size: page and limit with defaults, plus each
// listed filter that has a value.
export const toPageQuery = (
	params: ReadableParams,
	filters: readonly string[],
	pageSize: number,
): URLSearchParams => {
	const query = new URLSearchParams({
		page: params.get('page') || '1',
		limit: params.get('pageSize') || String(pageSize),
	})

	for (const key of filters) {
		const value = params.get(key)

		if (value) query.set(key, toDayBound(key, value))
	}

	return query
}
