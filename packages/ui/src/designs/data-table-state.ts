import type { DataTableInitialState, DataTableInitialStateOptions } from 'types/components'

export const columnLabel = (header: unknown, id: string): string =>
	typeof header === 'string' ? header : id

// Table state lives in the URL so filters survive reloads and can be shared. Every parameter is
// prefixed so several tables on one page keep their state apart.
export const readInitialTableState = ({
	searchParams,
	prefix,
	filters,
	pageSize,
}: DataTableInitialStateOptions): DataTableInitialState => {
	const param = (key: string) => searchParams.get(`${prefix}${key}`)
	const hidden = `hide_${prefix}`
	const sortBy = param('sortBy')
	const page = param('page')
	const size = param('pageSize')

	return {
		sorting: sortBy ? [{ id: sortBy, desc: param('order') === 'desc' }] : [],
		columnVisibility: Object.fromEntries(
			Array.from(searchParams.keys())
				.filter(key => key.startsWith(hidden))
				.map(key => [key.replace(hidden, ''), false]),
		),
		columnFilters: (filters ?? []).map(filter => ({
			id: filter.id,
			value: param(filter.id) ?? '',
		})),
		search: param('search') ?? '',
		date: { from: param('from') ?? '', to: param('to') ?? '' },
		pagination: {
			pageIndex: page ? Number(page) - 1 : 0,
			pageSize: size ? Number(size) : pageSize,
		},
	}
}
