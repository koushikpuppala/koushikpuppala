import { MetadataRoute } from 'next'
import { globby } from 'globby'
import { ISODate } from '@import/constant'

const SitemapPage = async (): Promise<MetadataRoute.Sitemap> => {
	const routes: MetadataRoute.Sitemap = []
	const paths = (await globby(['app/**/page.tsx', '!app/api/**/*', '!app/**/[id]/*', '!app/studio/**/*'])).map(path =>
		path.replace('app', '').replace('/page.tsx', ''),
	)

	paths.forEach(path => {
		const priority = 1 - (path.split('/').length - 1) * 0.2
		const date = new Date()

		let changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
		let lastModified: string | undefined = undefined

		switch (priority) {
			case 1:
				changeFrequency = 'always'
				lastModified = ISODate(date)
				break
			case 0.8:
				changeFrequency = 'hourly'
				lastModified = ISODate(date.setHours(date.getHours() - 1))
				break
			case 0.6:
				changeFrequency = 'daily'
				lastModified = ISODate(date.setDate(date.getDate() - 1))
				break
			case 0.4:
				changeFrequency = 'weekly'
				lastModified = ISODate(date.setDate(date.getDate() - 7))
				break
			case 0.2:
				changeFrequency = 'monthly'
				lastModified = ISODate(date.setMonth(date.getMonth() - 1))
				break
			case 0:
				changeFrequency = 'yearly'
				lastModified = ISODate(date.setFullYear(date.getFullYear() - 1))
				break
			default:
				changeFrequency = 'never'
				break
		}

		routes.push({
			url: `${process.env.NEXT_PUBLIC_DEPLOY_URL}${path}`,
			lastModified: lastModified,
			changeFrequency: changeFrequency,
			priority: priority > 0 ? priority : undefined,
		})
	})

	return [...routes]
}

export default SitemapPage
