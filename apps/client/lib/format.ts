const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function formatMonthYear(iso: string | null | undefined, fallback = 'Present') {
	if (!iso) return fallback
	const date = new Date(iso)
	if (Number.isNaN(date.getTime())) return fallback
	return `${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`
}

export function formatYear(iso: string | null | undefined, fallback = '—') {
	if (!iso) return fallback
	const date = new Date(iso)
	if (Number.isNaN(date.getTime())) return fallback
	return String(date.getUTCFullYear())
}

export function formatRange(start: string, end: string | null | undefined) {
	return `${formatMonthYear(start, '—')} — ${formatMonthYear(end)}`
}

export function durationLabel(start: string, end: string | null | undefined) {
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

/**
 * Split a display title into controlled hero lines: short titles break per
 * word, longer ones are balanced across at most `maxLines` lines.
 */
export function toDisplayLines(title: string, maxLines = 3) {
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

export function splitTitle(title: string) {
	const [main, ...rest] = title.split(/\s+[—–]\s+/)
	return { main: main ?? title, sub: rest.join(' — ') || null }
}

/** Service descriptions are comma-separated technology lists in the CMS. */
export function splitList(value: string) {
	return value
		.replace(/\.$/, '')
		.split(/,\s*/)
		.map(item => item.trim())
		.filter(Boolean)
}
