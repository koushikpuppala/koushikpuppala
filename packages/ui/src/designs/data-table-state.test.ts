import { describe, expect, it } from 'vitest'
import { columnLabel, readInitialTableState } from './data-table-state'

const read = (query: string, prefix = '') =>
	readInitialTableState({
		searchParams: new URLSearchParams(query),
		prefix,
		filters: [{ id: 'status', label: 'Status', type: 'search' }],
		pageSize: 10,
	})

describe('readInitialTableState', () => {
	it('starts empty when the URL has no table parameters', () => {
		expect(read('')).toEqual({
			sorting: [],
			columnVisibility: {},
			columnFilters: [{ id: 'status', value: '' }],
			search: '',
			date: { from: '', to: '' },
			pagination: { pageIndex: 0, pageSize: 10 },
		})
	})

	it('reads every parameter, turning the 1-based page into an index', () => {
		expect(
			read(
				'search=ada&status=open&from=2026-01-01&to=2026-01-31&sortBy=name&order=desc&page=3&pageSize=25&hide_email=true',
			),
		).toEqual({
			sorting: [{ id: 'name', desc: true }],
			columnVisibility: { email: false },
			columnFilters: [{ id: 'status', value: 'open' }],
			search: 'ada',
			date: { from: '2026-01-01', to: '2026-01-31' },
			pagination: { pageIndex: 2, pageSize: 25 },
		})
	})

	it('only reads parameters carrying its own prefix', () => {
		const state = read(
			'users_search=ada&search=other&hide_users_email=true&hide_email=true',
			'users_',
		)

		expect(state.search).toBe('ada')
		expect(state.columnVisibility).toEqual({ email: false })
	})
})

describe('columnLabel', () => {
	it('uses a string header and falls back to the column id', () => {
		expect(columnLabel('Name', 'name')).toBe('Name')
		expect(columnLabel(() => 'Name', 'name')).toBe('name')
	})
})
