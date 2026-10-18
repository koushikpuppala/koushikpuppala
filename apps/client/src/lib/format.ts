const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Dates are read in UTC so a month boundary never shifts with the visitor's time zone.
export const formatMonthYear = (iso: string | null | undefined, fallback = 'Present') => {
	if (!iso) return fallback

	const date = new Date(iso)

	if (Number.isNaN(date.getTime())) return fallback

	return `${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`
}

export const formatYear = (iso: string | null | undefined, fallback = '—') => {
	if (!iso) return fallback

	const date = new Date(iso)

	if (Number.isNaN(date.getTime())) return fallback

	return String(date.getUTCFullYear())
}

export const formatRange = (start: string, end: string | null | undefined) => {
	return `${formatMonthYear(start, '—')} — ${formatMonthYear(end)}`
}

export const durationLabel = (start: string, end: string | null | undefined, now?: Date | null) => {
	const from = new Date(start)

	if (Number.isNaN(from.getTime())) return ''

	const span = (to: Date) =>
		(to.getUTCFullYear() - from.getUTCFullYear()) * 12 + (to.getUTCMonth() - from.getUTCMonth())

	let months: number

	if (end) {
		const to = new Date(end)

		if (Number.isNaN(to.getTime())) return ''

		// Count both the start and end months, so Jan to Dec is 12 months.
		months = span(to) + 1
	} else {
		// Ongoing roles need the current date, which is only passed in on the client to avoid a
		// server and client mismatch.
		if (!now) return ''

		months = span(now) - (now.getUTCDate() < from.getUTCDate() ? 1 : 0)
	}

	months = Math.max(1, months)

	const years = Math.floor(months / 12)

	const rest = months % 12

	if (years && rest) return `${years} yr ${rest} mo`

	if (years) return `${years} yr`

	return `${months} mo`
}

export const toDisplayLines = (title: string, maxLines = 3) => {
	const words = title.trim().split(/\s+/).filter(Boolean)

	if (words.length === 0) return [title]

	if (words.length <= maxLines) return words

	const perLine = Math.ceil(words.length / maxLines)

	const lines: string[] = []

	for (let i = 0; i < words.length; i += perLine) {
		lines.push(words.slice(i, i + perLine).join(' '))
	}

	return lines
}

export const splitTitle = (title: string) => {
	const [main, ...rest] = title.split(/\s+[—–]\s+/)

	return { main: main ?? title, sub: rest.join(' — ') || null }
}
