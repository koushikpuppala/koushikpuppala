import type { ListQueryOptions, ReadableParams } from 'types/components/admin'
export const publishFilter = (value: string): [string, string] => [
	'isPublished',
	String(value === 'PUBLISHED'),
]

// Translates the DataTable's URL parameters into the API's query format: pageSize becomes limit,
// column ids map to API sort fields, and filters map to their API parameters.
export const toListQuery = (
	params: ReadableParams,
	{ sort = {}, filters = {} }: ListQueryOptions = {},
): URLSearchParams => {
	const query = new URLSearchParams()

	for (const key of ['page', 'search', 'from', 'to']) {
		const value = params.get(key)

		if (value) query.set(key, value)
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

		if (value) query.set(key, value)
	}

	return query
}
