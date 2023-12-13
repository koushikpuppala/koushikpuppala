import { MetadataRoute } from 'next'

const userAgents = ['Googlebot', 'googlebot-image', 'googlebot-mobile', 'MSNBot', 'Teoma', 'ia_archiver', 'psbot', '*']

const RobotsPage = (): MetadataRoute.Robots => {
	return {
		rules: userAgents.map(userAgent => ({
			userAgent,
			allow: '/',
			disallow: '/api/',
			crawlDelay: 5,
		})),
		sitemap: [
			`${process.env.NEXT_PUBLIC_VERCEL_URL}/sitemap.xml`,
		],
	}
}

export default RobotsPage
