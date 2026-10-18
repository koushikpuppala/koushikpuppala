import { describe, expect, it } from 'vitest'
import { pickFields } from './utils'

describe('pickFields', () => {
	it('keeps only listed keys and drops undefined values', () => {
		const record = { id: '1', title: 'T', status: 'PUBLISHED', subtitle: undefined, tags: [] }

		expect(pickFields(record, ['title', 'subtitle', 'tags'])).toEqual({ title: 'T', tags: [] })
	})

	it('keeps null and false, which are real values for the API', () => {
		expect(pickFields({ endDate: null, featured: false }, ['endDate', 'featured'])).toEqual({
			endDate: null,
			featured: false,
		})
	})
})
