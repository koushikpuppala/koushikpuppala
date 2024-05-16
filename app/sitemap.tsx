import { MetadataRoute } from 'next'
import { globby } from 'globby'

const readableDateTime = (date: string | number | Date) => {
	return new Date(date).toLocaleString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
		weekday: 'long',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		fractionalSecondDigits: 3,
		timeZoneName: 'longGeneric',
	})
}

const SitemapPage = async (): Promise<MetadataRoute.Sitemap> => {
	const routes: MetadataRoute.Sitemap = []
	const paths = (await globby(['app/**/page.tsx', '!app/api/**/*', '!app/**/[id]/*'])).map(path => {
		return path.replace('app', '').replace('/page.tsx', '')
	})

	paths.forEach(path => {
		const priority = 1 - (path.split('/').length - 1) * 0.2
		const date = new Date()

		let changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
		let lastModified: string | undefined = undefined

		switch (priority) {
			case 1:
				changeFrequency = 'always'
				lastModified = readableDateTime(date)
				break
			case 0.8:
				changeFrequency = 'hourly'
				lastModified = readableDateTime(date.setHours(date.getHours() - 1))
				break
			case 0.6:
				changeFrequency = 'daily'
				lastModified = readableDateTime(date.setDate(date.getDate() - 1))
				break
			case 0.4:
				changeFrequency = 'weekly'
				lastModified = readableDateTime(date.setDate(date.getDate() - 7))
				break
			case 0.2:
				changeFrequency = 'monthly'
				lastModified = readableDateTime(date.setMonth(date.getMonth() - 1))
				break
			case 0:
				changeFrequency = 'yearly'
				lastModified = readableDateTime(date.setFullYear(date.getFullYear() - 1))
				break
			default:
				changeFrequency = 'never'
				break
		}

		routes.push({
			url: `${process.env.NEXT_PUBLIC_VERCEL_URL}${path}`,
			lastModified: lastModified,
			changeFrequency: changeFrequency,
			priority: priority > 0 ? priority : undefined,
		})
	})

	return [...routes]
}

export default SitemapPage
