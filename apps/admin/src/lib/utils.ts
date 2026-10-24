export const pickFields = (source: object, keys: readonly string[]): Record<string, unknown> => {
	const record = source as Record<string, unknown>
	const result: Record<string, unknown> = {}

	for (const key of keys) if (record[key] !== undefined) result[key] = record[key]

	return result
}
