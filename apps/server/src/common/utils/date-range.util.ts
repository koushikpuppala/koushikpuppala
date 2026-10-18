import type { CreatedAtFilter, DateRange, DateRangeQuery } from 'types/server'

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

export const getDateRange = (query: DateRangeQuery): DateRange => {
	const { range, from, to } = query

	if (from && to) {
		const start = new Date(from)
		start.setHours(0, 0, 0, 0)

		const end = new Date(to)
		end.setHours(23, 59, 59, 999)

		return { from: start, to: end }
	}

	const now = new Date()

	switch (range) {
		case 'today': {
			const start = new Date(now)
			start.setHours(0, 0, 0, 0)

			const end = new Date(now)
			end.setHours(23, 59, 59, 999)

			return { from: start, to: end }
		}

		case 'week': {
			const start = new Date(now)

			// Weeks start on Monday; getDay() returns 0 for Sunday.

			const day = start.getDay() === 0 ? 6 : start.getDay() - 1

			start.setDate(start.getDate() - day)
			start.setHours(0, 0, 0, 0)

			const end = new Date(now)
			end.setHours(23, 59, 59, 999)

			return { from: start, to: end }
		}

		case 'month': {
			const start = new Date(now.getFullYear(), now.getMonth(), 1)
			start.setHours(0, 0, 0, 0)

			const end = new Date(now)
			end.setHours(23, 59, 59, 999)

			return { from: start, to: end }
		}

		// Financial year to date, starting 1 April.
		default: {
			const currentYear = now.getFullYear()
			const currentMonth = now.getMonth()

			const fyStartYear = currentMonth >= 3 ? currentYear : currentYear - 1

			const start = new Date(fyStartYear, 3, 1)
			start.setHours(0, 0, 0, 0)

			const end = new Date(now)
			end.setHours(23, 59, 59, 999)

			return { from: start, to: end }
		}
	}
}
