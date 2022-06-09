const fs = require('fs')

function addPage(page) {
	const path = page.replace('pages', '').replace('.tsx', '')
	const route = path === '/index' ? '' : path
	return `  <url>
    <loc>${`${process.env.WEBSITE_URL}${route}`}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
	</url>`
}

async function generateSitemap() {
	const { globby } = await import('globby')
	// excludes Nextjs files and API routes.
	const pages = await globby(['pages/**/*.tsx', '!pages/_*.tsx', '!pages/api'])
	console.log(pages)
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
	<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	${pages.map((page) => addPage(page)).join('\n')}
	</urlset>`
	fs.writeFileSync('public/sitemap.xml', sitemap)
}

generateSitemap()
