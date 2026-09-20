import type { MetadataRoute } from 'next'
import { SITE_DOMAIN } from 'constants/api-fallback'

export default function robots(): MetadataRoute.Robots {
	const baseUrl = process.env.NEXT_PUBLIC_DEPLOY_URL || SITE_DOMAIN

	return {
		rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/admin/'] }],
		sitemap: `${baseUrl}/sitemap.xml`,
	}
}
