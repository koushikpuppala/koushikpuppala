import type { MetadataRoute } from 'next'
import { SITE_DOMAIN } from '../lib/metadata-data'
import { getAllProjects } from '../lib/projects-data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = process.env.NEXT_PUBLIC_DEPLOY_URL || SITE_DOMAIN
	const currentDate = new Date()

	const staticRoutes: MetadataRoute.Sitemap = [
		{
			url: baseUrl,
			lastModified: currentDate,
			changeFrequency: 'weekly',
			priority: 1.0,
		},
		{
			url: `${baseUrl}/projects`,
			lastModified: currentDate,
			changeFrequency: 'weekly',
			priority: 0.9,
		},
		{
			url: `${baseUrl}/resume`,
			lastModified: currentDate,
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		{
			url: `${baseUrl}/contact`,
			lastModified: currentDate,
			changeFrequency: 'monthly',
			priority: 0.8,
		},
	]

	try {
		const projects = await getAllProjects()
		const projectRoutes: MetadataRoute.Sitemap = projects
			.filter(p => p.status !== 'ARCHIVED')
			.map(p => ({
				url: `${baseUrl}/projects/${p.slug}`,
				lastModified: currentDate,
				changeFrequency: 'monthly',
				priority: p.featured ? 0.85 : 0.7,
			}))

		return [...staticRoutes, ...projectRoutes]
	} catch {
		return staticRoutes
	}
}
