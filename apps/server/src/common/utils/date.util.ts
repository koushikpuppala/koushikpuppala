// Keeps undefined (field not sent, leave unchanged) distinct from null or '' (clear the value).
export const toDate = (value: string | Date | null | undefined): Date | null | undefined => {
	if (value === undefined) return undefined

	return value ? new Date(value) : null
}
