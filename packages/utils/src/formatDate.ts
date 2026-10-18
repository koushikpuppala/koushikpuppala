export const formatDate = (date: Date | string, locale: string = 'en-US'): string =>
	(typeof date === 'string' ? new Date(date) : date).toLocaleDateString(locale, {
		year: 'numeric',
		month: 'short',
		day: '2-digit',
	})
