import type { TableUrlSyncOptions } from 'types/components'
import { describe, expect, it } from 'vitest'
import { buildTableQuery } from './use-table-url-sync'

const options = (overrides: Partial<TableUrlSyncOptions> = {}): TableUrlSyncOptions => ({
	prefix: '',
	defaultPageSize: 10,
	pagination: { pageIndex: 0, pageSize: 10 },
	search: '',
	date: { from: '', to: '' },
	sorting: [],
	columnFilters: [],
	columnVisibility: {},
	disableSearch: false,
	disableDateRange: false,
	disablePageSizeOptions: false,
	...overrides,
})

const build = (current: string, overrides?: Partial<TableUrlSyncOptions>) =>
	Object.fromEntries(buildTableQuery(new URLSearchParams(current), options(overrides)))

describe('buildTableQuery', () => {
	it('leaves defaults out of the URL', () => {
		expect(build('')).toEqual({})
	})

	it('writes the table state as URL parameters', () => {
		expect(
			build('', {
				pagination: { pageIndex: 2, pageSize: 25 },
				search: 'ada',
				date: { from: '2026-01-01', to: '2026-01-31' },
				sorting: [{ id: 'name', desc: true }],
				columnVisibility: { email: false, name: true },
				columnFilters: [
					{ id: 'status', value: 'open' },
					{ id: 'role', value: '' },
				],
			}),
		).toEqual({
			page: '3',
			pageSize: '25',
			search: 'ada',
			from: '2026-01-01',
			to: '2026-01-31',
			sortBy: 'name',
			order: 'desc',
			hide_email: 'true',
			status: 'open',
		})
	})

	it('keeps other tables parameters and replaces only its own', () => {
		expect(
			build('users_search=old&logs_search=keep&hide_logs_email=true&tab=2', {
				prefix: 'users_',
				search: 'new',
			}),
		).toEqual({ logs_search: 'keep', hide_logs_email: 'true', tab: '2', users_search: 'new' })
	})

	it('respects disabled controls', () => {
		expect(
			build('', {
				search: 'ada',
				date: { from: '2026-01-01', to: '' },
				pagination: { pageIndex: 0, pageSize: 50 },
				disableSearch: true,
				disableDateRange: true,
				disablePageSizeOptions: true,
			}),
		).toEqual({})
	})
})
