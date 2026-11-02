// Takes the value rather than the name because Next.js inlines NEXT_PUBLIC_ variables only when
// written literally as process.env.NAME.
export const requireEnv = (value: string | undefined, name: string): string => {
	if (!value) throw new Error(`Missing environment variable: ${name}`)

	return value
}
