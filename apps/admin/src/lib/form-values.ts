export const asList = (value: unknown): string[] => {
	if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string')

	return typeof value === 'string' && value ? [value] : []
}

// Trims an ISO timestamp to YYYY-MM-DD, the format <input type='date'> expects.
export const dateValue = (value: unknown): string => (value ? String(value).slice(0, 10) : '')
