const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

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

export const durationLabel = (start: string, end: string | null | undefined) => {
	const from = new Date(start)

	const to = end ? new Date(end) : new Date('2026-03-01T00:00:00Z')

	if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return ''

	const months = Math.max(
		1,
		(to.getUTCFullYear() - from.getUTCFullYear()) * 12 +
			(to.getUTCMonth() - from.getUTCMonth()) +
			1,
	)

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

export const splitList = (value: string) => {
	return value
		.replace(/\.$/, '')
		.split(/,\s*/)
		.map(item => item.trim())
		.filter(Boolean)
}
