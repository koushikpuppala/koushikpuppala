import type { MetadataRoute } from 'next'
import { SITE_DOMAIN } from 'constants/site'

const robots = (): MetadataRoute.Robots => {
	const baseUrl = SITE_DOMAIN

	return {
		rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/admin/', '/resume/download'] }],
		sitemap: `${baseUrl}/sitemap.xml`,
	}
}

export default robots
