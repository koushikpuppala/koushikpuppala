import type { CreatedAtFilter } from 'types/server'

export const createdAtRange = (from?: string, to?: string): CreatedAtFilter | undefined => {
	if (!from && !to) return undefined

	const range: CreatedAtFilter = {}

	if (from) {
		range.gte = new Date(from)
		range.gte.setHours(0, 0, 0, 0)
	}

	if (to) {
		range.lte = new Date(to)
		range.lte.setHours(23, 59, 59, 999)
	}

	return range
}
