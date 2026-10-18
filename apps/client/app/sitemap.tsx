import { SITE_DOMAIN } from 'constants/site'
import { getProjectsData } from 'lib/projects-data'
import type { MetadataRoute } from 'next'
import type { SitemapEntry } from 'types/components/client'
import { join } from 'node:path'
import { findStaticRoutes } from 'lib/static-routes'

const ROUTE_HINTS: Record<string, Pick<SitemapEntry, 'changeFrequency' | 'priority'>> = {
	'/': { changeFrequency: 'weekly', priority: 1.0 },
	'/projects': { changeFrequency: 'weekly', priority: 0.9 },
}

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
	const lastModified = new Date()

	const routes = await findStaticRoutes(join(process.cwd(), 'app'))

	const staticRoutes: MetadataRoute.Sitemap = routes.map(route => ({
		url: route === '/' ? SITE_DOMAIN : `${SITE_DOMAIN}${route}`,
		lastModified,
		changeFrequency: 'monthly',
		priority: 0.8,
		...ROUTE_HINTS[route],
	}))

	try {
		const projects = await getProjectsData()

		const projectRoutes: MetadataRoute.Sitemap = projects
			.filter(p => p.status !== 'ARCHIVED')
			.map(p => ({
				url: `${SITE_DOMAIN}/projects/${p.slug}`,
				lastModified,
				changeFrequency: 'monthly',
				priority: p.featured ? 0.85 : 0.7,
			}))

		return [...staticRoutes, ...projectRoutes]
	} catch {
		return staticRoutes
	}
}

export default sitemap
