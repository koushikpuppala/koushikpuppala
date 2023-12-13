import { MetadataRoute } from 'next'
import { globby } from 'globby'

const SitemapPage = async (): Promise<MetadataRoute.Sitemap> => {
	const routes: MetadataRoute.Sitemap = []
	const paths = (await globby(['app/**/page.tsx', '!app/api/**/*', '!app/**/[id]/*'])).map(path => {
		return path.replace('app', '').replace('/page.tsx', '')
	})

	paths.forEach(path => {
		const priority = Number((1 - (path.split('/').length - 1) * 0.2).toFixed(1))
		const changeFrequency =
			priority === 1
				? 'always'
				: priority === 0.8
					? 'hourly'
					: priority === 0.6
						? 'daily'
						: priority === 0.4
							? 'weekly'
							: priority === 0.2
								? 'monthly'
								: priority === 0
									? 'yearly'
									: 'never'
		const lastModified =
			priority === 1
				? new Date().toLocaleString()
				: priority === 0.8
					? new Date(new Date().setHours(new Date().getHours() - 1)).toLocaleString()
					: priority === 0.6
						? new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleString()
						: priority === 0.4
							? new Date(new Date().setDate(new Date().getDate() - 7)).toLocaleString()
							: priority === 0.2
								? new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleString()
								: priority === 0
									? new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toLocaleString()
									: undefined

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
