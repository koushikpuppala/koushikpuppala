export type DateRange = { from: Date; to: Date }

export function getDateRange(query: {
	range?: 'today' | 'week' | 'month' | 'year'
	from?: string
	to?: string
}): DateRange {
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

		default: {
			const currentYear = now.getFullYear()
			const currentMonth = now.getMonth() // 0-indexed: 3 = April

			const fyStartYear = currentMonth >= 3 ? currentYear : currentYear - 1

			const start = new Date(fyStartYear, 3, 1) // 1st April
			start.setHours(0, 0, 0, 0)

			const end = new Date(now)
			end.setHours(23, 59, 59, 999)

			return { from: start, to: end }
		}
	}
}
