import { describe, expect, it } from 'vitest'
import { publishFilter, toListQuery, toPageQuery } from './list-query'

const query = (url: string, options?: Parameters<typeof toListQuery>[1]) =>
	toListQuery(new URLSearchParams(url), options).toString()

describe('toListQuery', () => {
	it('sends nothing for an untouched table, so the API pages at its default', () => {
		expect(query('')).toBe('')
	})

	it('renames the table parameters to the API ones', () => {
		const params = toListQuery(
			new URLSearchParams('page=3&pageSize=25&search=ada&from=2026-10-01&to=2026-10-09'),
		)

		expect(Object.fromEntries(params)).toEqual({
			page: '3',
			search: 'ada',
			from: new Date(2026, 9, 1).toISOString(),
			to: new Date(2026, 9, 9, 23, 59, 59, 999).toISOString(),
			limit: '25',
		})
	})

	it('maps a sorted column to its API field and direction', () => {
		expect(query('sortBy=name&order=desc', { sort: { name: 'displayName' } })).toBe(
			'sortBy=displayName&sortOrder=desc',
		)
		expect(query('sortBy=title&order=asc')).toBe('sortBy=title&sortOrder=asc')
	})

	it('passes declared filters and converts the publish filter', () => {
		const options = { filters: { role: 'role', status: publishFilter } }

		expect(query('role=ADMIN&status=DRAFT', options)).toBe('role=ADMIN&isPublished=false')
		expect(query('status=PUBLISHED', options)).toBe('isPublished=true')
	})

	it("ignores parameters that are not the table's to send", () => {
		expect(query('id=42&hide_status=true&priority=HIGH')).toBe('')
	})
})

describe('toPageQuery', () => {
	const page = (url: string) =>
		toPageQuery(new URLSearchParams(url), ['search', 'method'], 25).toString()

	it('always sends a page and the table page size', () => {
		expect(page('')).toBe('page=1&limit=25')
	})

	it('keeps the table page, page size and the listed filters that have a value', () => {
		expect(page('page=2&pageSize=50&search=users&method=&other=x')).toBe(
			'page=2&limit=50&search=users',
		)
	})

	it('sends picked days as the start and end of that local day', () => {
		const params = toPageQuery(
			new URLSearchParams('from=2026-10-04&to=2026-10-04'),
			['from', 'to'],
			25,
		)

		expect(params.get('from')).toBe(new Date(2026, 9, 4).toISOString())
		expect(params.get('to')).toBe(new Date(2026, 9, 4, 23, 59, 59, 999).toISOString())
	})
})
