// A bare `YYYY-MM-DD` is a calendar day, but `new Date()` parses it as UTC midnight, which shows as the previous day west of UTC.
const toDate = (date: Date | string): Date => {
	if (typeof date !== 'string') return date

	const day = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)

	return day ? new Date(Number(day[1]), Number(day[2]) - 1, Number(day[3])) : new Date(date)
}

export const formatDate = (date: Date | string, locale: string = 'en-US'): string =>
	toDate(date).toLocaleDateString(locale, {
		year: 'numeric',
		month: 'short',
		day: '2-digit',
	})
