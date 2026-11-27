const UNITS = [
	['year', 31_536_000],
	['month', 2_592_000],
	['day', 86_400],
	['hour', 3_600],
	['minute', 60],
] as const

export const formatRelativeTime = (
	date: Date | string,
	now: Date = new Date(),
	locale: string = 'en-US',
): string => {
	const seconds = Math.round((new Date(date).getTime() - now.getTime()) / 1000)
	const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

	for (const [unit, size] of UNITS)
		if (Math.abs(seconds) >= size) return formatter.format(Math.round(seconds / size), unit)

	return 'just now'
}
