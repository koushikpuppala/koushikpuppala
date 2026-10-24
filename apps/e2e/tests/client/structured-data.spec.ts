import { expect, test, type Page } from '@playwright/test'
import { CLIENT_URL, CONTENT } from '../../env'

type JsonLdNode = Record<string, unknown> & { '@type'?: string; '@id'?: string }

const readGraph = async (page: Page): Promise<JsonLdNode[]> => {
	const scripts = await page.locator('script[type="application/ld+json"]').allTextContents()

	expect(scripts).toHaveLength(1)

	const data = JSON.parse(scripts[0] ?? '{}')

	expect(data['@context']).toBe('https://schema.org')

	return data['@graph']
}

const nodeOfType = (graph: JsonLdNode[], type: string) => graph.find(node => node['@type'] === type)

// Every { "@id": ... } a page points at must be described in that same page, or Google drops the link.
const danglingReferences = (graph: JsonLdNode[]): string[] => {
	const defined = new Set(graph.map(node => node['@id']))
	const referenced: string[] = []

	const walk = (value: unknown) => {
		if (!value || typeof value !== 'object') return

		const entries = Object.entries(value)
		if (entries.length === 1 && entries[0]?.[0] === '@id') referenced.push(String(entries[0][1]))

		for (const [, child] of entries) walk(child)
	}

	walk(graph)

	return referenced.filter(id => !defined.has(id))
}

const PAGES = [
	{ path: '/', type: 'ProfilePage', crumbs: 0 },
	{ path: '/about', type: 'AboutPage', crumbs: 2 },
	{ path: '/experience', type: 'ProfilePage', crumbs: 2 },
	{ path: '/education', type: 'ProfilePage', crumbs: 2 },
	{ path: '/projects', type: 'CollectionPage', crumbs: 2 },
	{ path: '/services', type: 'CollectionPage', crumbs: 2 },
	{ path: '/resume', type: 'ProfilePage', crumbs: 2 },
	{ path: '/contact', type: 'ContactPage', crumbs: 2 },
	{ path: `/projects/${CONTENT.publishedProject.slug}`, type: 'WebPage', crumbs: 3 },
]

test.describe('structured data', () => {
	for (const { path, type, crumbs } of PAGES) {
		test(`${path} has ${type} structured data with intact links`, async ({ page }) => {
			await page.goto(path)

			const graph = await readGraph(page)
			const url = path === '/' ? CLIENT_URL : `${CLIENT_URL}${path}`

			expect(nodeOfType(graph, 'WebSite')).toMatchObject({ '@id': `${CLIENT_URL}/#website` })
			expect(nodeOfType(graph, 'Person')).toMatchObject({ '@id': `${CLIENT_URL}/#person` })
			expect(nodeOfType(graph, type)).toMatchObject({ '@id': `${CLIENT_URL}${path}#webpage`, url })
			expect(danglingReferences(graph)).toEqual([])

			const breadcrumbs = nodeOfType(graph, 'BreadcrumbList')?.itemListElement as
				JsonLdNode[] | undefined

			expect(breadcrumbs?.length ?? 0).toBe(crumbs)
			if (breadcrumbs) expect(breadcrumbs.at(-1)).toMatchObject({ position: crumbs, item: url })
		})
	}

	test('the home page describes the person from published content', async ({ page }) => {
		await page.goto('/')

		const graph = await readGraph(page)
		const person = nodeOfType(graph, 'Person')

		expect(nodeOfType(graph, 'ProfilePage')?.dateModified).toEqual(expect.any(String))

		expect(person).toMatchObject({
			jobTitle: CONTENT.experience.title,
			description: 'Builds web platforms end to end.',
			homeLocation: { '@type': 'Place', name: CONTENT.about.location },
			worksFor: [
				{
					'@type': 'OrganizationRole',
					roleName: CONTENT.experience.title,
					worksFor: { '@type': 'Organization', name: CONTENT.experience.organization },
				},
			],
			alumniOf: [{ '@type': 'CollegeOrUniversity', name: CONTENT.education.university }],
			hasCredential: [
				{
					'@type': 'EducationalOccupationalCredential',
					name: `${CONTENT.education.degree}, ${CONTENT.education.fieldOfStudy}`,
				},
			],
			sameAs: ['https://github.com/e2e'],
		})
		expect(person?.knowsAbout).toContain(CONTENT.about.skill)
	})

	test('a project page describes the project and lists only published projects', async ({
		page,
	}) => {
		await page.goto(`/projects/${CONTENT.publishedProject.slug}`)

		expect(nodeOfType(await readGraph(page), 'CreativeWork')).toMatchObject({
			name: CONTENT.publishedProject.title,
			description: `${CONTENT.publishedProject.title} summary.`,
			keywords: ['fintech', 'e2e', 'NestJS'],
			author: { '@id': `${CLIENT_URL}/#person` },
			datePublished: expect.any(String),
			dateModified: expect.any(String),
		})

		await page.goto('/projects')

		const list = nodeOfType(await readGraph(page), 'ItemList')?.itemListElement as
			JsonLdNode[] | undefined
		const names = (list ?? []).map(item => item.name)

		expect(names).toContain(CONTENT.publishedProject.title)
		expect(names).not.toContain(CONTENT.draftProject.title)
	})
})
