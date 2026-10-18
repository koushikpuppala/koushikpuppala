// Takes the value rather than the name because Next.js only inlines NEXT_PUBLIC_ variables
// written literally as process.env.NAME; a dynamic process.env[name] lookup would be undefined.
export const requireEnv = (value: string | undefined, name: string): string => {
	if (!value) throw new Error(`Missing environment variable: ${name}`)

	return value
}
