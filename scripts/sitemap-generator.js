const fs = require('fs')

const addPage = page => {
	const path = page.replace('pages', '').replace('.tsx', '')
	const route = path === '/index' ? '' : path
	return `
	<url>
		<loc>${`https://koushikpuppala.com${route}`}</loc>
		<lastmod>${new Date().toISOString()}</lastmod>
		<changefreq>monthly</changefreq>
		<priority>1.0</priority>
	</url>`
}

const generateSitemap = async () => {
	const { globby } = await import('globby')
	// excludes Nextjs files and API routes.
	const pages = await globby(['pages/**/*.tsx', '!pages/_*.tsx', '!pages/api'])
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
	<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
		${pages.map(page => addPage(page)).join('\n')}

	</urlset>`
	fs.writeFileSync('public/sitemap.xml', sitemap)
}

generateSitemap()
