// @vitest-environment node
import type {
	PublishedAbout,
	PublishedEducation,
	PublishedExperience,
	PublishedHome,
	PublishedProject,
	PublishedService,
	PublishedSocial,
} from 'types/models'

import { describe, expect, it } from 'vitest'
import { SITE_DOMAIN } from 'constants/site'
import {
	buildPageGraph,
	buildPerson,
	buildProject,
	buildProjectList,
	buildServiceList,
} from './structured-data'

const home = {
	featuredSkills: ['Next.js', 'NestJS'],
	profileImageUrl: 'https://assets.example.com/me.webp',
} as PublishedHome

const about = {
	leadStatement: 'I build web platforms.',
	location: 'Hyderabad, India',
	skills: ['NestJS', 'PostgreSQL'],
	updatedAt: '2026-05-01T00:00:00.000Z',
} as PublishedAbout

const experience = [
	{
		title: 'Software Engineer',
		organization: 'Acme',
		website: 'https://acme.example.com',
		startDate: '2024-01-01T00:00:00.000Z',
		isCurrent: true,
	},
	{
		title: 'Intern',
		organization: 'Initech',
		startDate: '2023-01-01T00:00:00.000Z',
		endDate: '2023-06-01T00:00:00.000Z',
		isCurrent: false,
	},
] as PublishedExperience[]

const education = [
	{ degree: 'B.Tech', fieldOfStudy: 'Computer Science', university: 'JNTU', isCurrent: false },
	{ degree: 'M.S.', fieldOfStudy: 'Software', university: 'State U', isCurrent: true },
] as PublishedEducation[]

const socials: PublishedSocial[] = [
	{ id: '1', platform: 'GITHUB', url: 'https://github.com/koushik', label: null, sortOrder: 0 },
	{ id: '2', platform: 'EMAIL', url: 'mailto:me@example.com', label: null, sortOrder: 1 },
]

const project = {
	slug: 'payments',
	title: 'Payments Platform',
	subtitle: 'Card rails',
	category: 'Fintech',
	shortDescription: 'Moves money.',
	descriptions: ['A ledger and card rails.'],
	role: 'Lead engineer',
	tags: ['fintech', 'NestJS'],
	technologies: ['NestJS', 'PostgreSQL'],
	liveUrl: 'https://pay.example.com',
	github: null,
	heroImageUrl: 'https://assets.example.com/p1.webp',
	startDate: 'not a date',
} as PublishedProject

const json = (value: unknown) => JSON.parse(JSON.stringify(value))

const nodeOfType = (graph: ReturnType<typeof buildPageGraph>, type: string) =>
	json(graph['@graph']).find((node: { '@type': string }) => node['@type'] === type)

describe('buildPerson', () => {
	it('describes the person, their jobs and degrees from published content', () => {
		const person = json(
			buildPerson({
				home,
				about,
				experience,
				education,
				socials,
				services: [{ title: 'APIs' } as PublishedService],
			}),
		)

		expect(person).toMatchObject({
			'@id': `${SITE_DOMAIN}/#person`,
			image: { '@type': 'ImageObject', url: 'https://assets.example.com/me.webp' },
			jobTitle: 'Software Engineer',
			homeLocation: { name: 'Hyderabad, India' },
			knowsAbout: ['Next.js', 'NestJS', 'PostgreSQL', 'APIs'],
			email: 'mailto:me@example.com',
			sameAs: ['https://github.com/koushik'],
		})
		expect(person.worksFor).toEqual([
			{
				'@type': 'OrganizationRole',
				roleName: 'Software Engineer',
				startDate: '2024-01-01T00:00:00.000Z',
				worksFor: { '@type': 'Organization', name: 'Acme', url: 'https://acme.example.com' },
			},
			{
				'@type': 'OrganizationRole',
				roleName: 'Intern',
				startDate: '2023-01-01T00:00:00.000Z',
				endDate: '2023-06-01T00:00:00.000Z',
				worksFor: { '@type': 'Organization', name: 'Initech' },
			},
		])
		expect(person.alumniOf.map((org: { name: string }) => org.name)).toEqual(['JNTU', 'State U'])
		expect(person.hasCredential).toEqual([
			{
				'@type': 'EducationalOccupationalCredential',
				credentialCategory: 'degree',
				name: 'B.Tech, Computer Science',
				recognizedBy: { '@type': 'CollegeOrUniversity', name: 'JNTU' },
			},
		])
	})

	it('leaves fields out when the API returned nothing', () => {
		expect(json(buildPerson({}))).toEqual({
			'@type': 'Person',
			'@id': `${SITE_DOMAIN}/#person`,
			name: 'Koushik Puppala',
			url: SITE_DOMAIN,
		})
	})
})

describe('buildPageGraph', () => {
	it('gives the home page a profile page with no breadcrumbs', () => {
		const graph = buildPageGraph({
			path: '/',
			type: 'ProfilePage',
			name: 'Koushik Puppala',
			person: buildPerson({}),
		})

		expect(graph['@context']).toBe('https://schema.org')
		expect(nodeOfType(graph, 'ProfilePage')).toMatchObject({
			'@id': `${SITE_DOMAIN}/#webpage`,
			url: SITE_DOMAIN,
			mainEntity: { '@id': `${SITE_DOMAIN}/#person` },
		})
		expect(nodeOfType(graph, 'ProfilePage').breadcrumb).toBeUndefined()
		expect(nodeOfType(graph, 'BreadcrumbList')).toBeUndefined()
		expect(nodeOfType(graph, 'WebSite')).toBeDefined()
	})

	it('points a list page at its list and adds breadcrumbs', () => {
		const graph = buildPageGraph({
			path: '/projects',
			type: 'CollectionPage',
			name: 'Projects',
			person: buildPerson({}),
			mainEntity: buildProjectList([project]),
		})

		expect(nodeOfType(graph, 'CollectionPage')).toMatchObject({
			mainEntity: { '@id': `${SITE_DOMAIN}/projects#list` },
			breadcrumb: { '@id': `${SITE_DOMAIN}/projects#breadcrumb` },
		})
		expect(nodeOfType(graph, 'BreadcrumbList').itemListElement).toEqual([
			{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_DOMAIN },
			{ '@type': 'ListItem', position: 2, name: 'Projects', item: `${SITE_DOMAIN}/projects` },
		])
		expect(nodeOfType(graph, 'ItemList').itemListElement).toEqual([
			{
				'@type': 'ListItem',
				position: 1,
				name: 'Payments Platform',
				url: `${SITE_DOMAIN}/projects/payments`,
			},
		])
	})
})

describe('buildProject', () => {
	it('describes a project and drops dates it cannot parse', () => {
		expect(json(buildProject(project))).toMatchObject({
			'@id': `${SITE_DOMAIN}/projects/payments#project`,
			name: 'Payments Platform',
			abstract: 'A ledger and card rails.',
			keywords: ['fintech', 'NestJS', 'PostgreSQL'],
			sameAs: ['https://pay.example.com'],
			creator: { '@type': 'Role', roleName: 'Lead engineer' },
			mainEntityOfPage: { '@id': `${SITE_DOMAIN}/projects/payments#webpage` },
		})
		expect(json(buildProject(project)).dateCreated).toBeUndefined()
	})
})

describe('buildServiceList', () => {
	it('lists each service with you as the provider', () => {
		const list = json(
			buildServiceList([{ title: 'APIs', description: 'REST and GraphQL' } as PublishedService]),
		)

		expect(list.itemListElement[0].item).toEqual({
			'@type': 'Service',
			name: 'APIs',
			description: 'REST and GraphQL',
			provider: { '@id': `${SITE_DOMAIN}/#person` },
		})
	})
})
