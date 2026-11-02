import { globby } from 'globby'

export const toStaticRoute = (pageFile: string): string | null => {
	const segments = pageFile.split('/').slice(0, -1)

	if (segments.some(s => s.startsWith('[') || s.startsWith('_') || s.startsWith('@'))) return null

	const path = segments.filter(s => !(s.startsWith('(') && s.endsWith(')'))).join('/')
	return `/${path}`
}

export const findStaticRoutes = async (appDir: string): Promise<string[]> => {
	const pages = await globby('**/page.{js,jsx,ts,tsx,md,mdx}', { cwd: appDir })

	return pages
		.map(toStaticRoute)
		.filter((route): route is string => route !== null)
		.sort()
}
