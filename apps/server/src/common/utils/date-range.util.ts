import type { CreatedAtFilter } from 'types/server'

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/

const bound = (value: string, edge: 'start' | 'end'): Date =>
	DATE_ONLY.test(value)
		? new Date(`${value}T${edge === 'start' ? '00:00:00.000' : '23:59:59.999'}Z`)
		: new Date(value)

export const createdAtRange = (from?: string, to?: string): CreatedAtFilter | undefined => {
	if (!from && !to) return undefined

	const range: CreatedAtFilter = {}

	if (from) range.gte = bound(from, 'start')

	if (to) range.lte = bound(to, 'end')

	return range
}
