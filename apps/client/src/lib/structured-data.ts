import type { PublishedProject, PublishedService } from 'types/models'
import type {
	PageGraphInput,
	PersonGraphInput,
	StructuredData,
	StructuredDataNode,
} from 'types/components/client'

import { emailAddress } from 'lib/email'
import { SITE_DOMAIN, SITE_NAME } from 'constants/site'

// Stable node ids let every page point at the same Person and WebSite instead of describing them again.
const PERSON_ID = `${SITE_DOMAIN}/#person`
const WEBSITE_ID = `${SITE_DOMAIN}/#website`

const isoDate = (value?: Date | string | null): string | undefined => {
	if (!value) return undefined

	const date = new Date(value)

	return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

const nonEmpty = <T>(items: T[]): T[] | undefined => (items.length ? items : undefined)

const unique = (items: string[]): string[] => [
	...new Set(items.map(item => item.trim()).filter(Boolean)),
]

const isWebUrl = (url?: string | null): url is string => Boolean(url && /^https?:\/\//i.test(url))

const webUrl = (url?: string | null): string | undefined => (isWebUrl(url) ? url : undefined)

const absolute = (path: string): string => (path === '/' ? SITE_DOMAIN : `${SITE_DOMAIN}${path}`)

export const buildPerson = ({
	home,
	about,
	experience = [],
	education = [],
	services = [],
	socials = [],
}: PersonGraphInput): StructuredDataNode => {
	const current = experience.find(item => item.isCurrent || !item.endDate)
	const email = emailAddress(socials)
	const image = webUrl(home?.profileImageUrl) ?? webUrl(about?.profileImageUrl)
	const universities = [...new Map(education.map(item => [item.university, item])).values()]

	return {
		'@type': 'Person',
		'@id': PERSON_ID,
		name: SITE_NAME,
		url: SITE_DOMAIN,
		image: image ? { '@type': 'ImageObject', url: image, caption: SITE_NAME } : undefined,
		description: about?.leadStatement || undefined,
		jobTitle: current?.title,
		// The Role pattern keeps each job's title and dates, so ended jobs read as history, not current work.
		worksFor: nonEmpty(
			experience.map(item => ({
				'@type': 'OrganizationRole' as const,
				roleName: item.title,
				startDate: isoDate(item.startDate),
				endDate: item.isCurrent ? undefined : isoDate(item.endDate),
				worksFor: {
					'@type': 'Organization' as const,
					name: item.organization,
					url: webUrl(item.website),
				},
			})),
		),
		alumniOf: nonEmpty(
			universities.map(item => ({
				'@type': 'CollegeOrUniversity' as const,
				name: item.university,
				url: webUrl(item.website),
			})),
		),
		hasCredential: nonEmpty(
			education
				.filter(item => !item.isCurrent && item.degree)
				.map(item => ({
					'@type': 'EducationalOccupationalCredential' as const,
					credentialCategory: 'degree',
					name: item.fieldOfStudy ? `${item.degree}, ${item.fieldOfStudy}` : item.degree,
					recognizedBy: { '@type': 'CollegeOrUniversity' as const, name: item.university },
				})),
		),
		homeLocation: about?.location ? { '@type': 'Place', name: about.location } : undefined,
		knowsAbout: nonEmpty(
			unique([
				...(home?.featuredSkills ?? []),
				...(about?.skills ?? []),
				...services.map(service => service.title),
			]),
		),
		email: email ? `mailto:${email}` : undefined,
		sameAs: nonEmpty(socials.map(social => social.url).filter(isWebUrl)),
	}
}

export const buildPageGraph = ({
	path,
	type,
	name,
	person,
	mainEntity,
	crumbs = path === '/' ? [] : [{ name, path }],
	dateModified,
}: PageGraphInput): StructuredData => {
	const url = absolute(path)
	const breadcrumbId = `${SITE_DOMAIN}${path}#breadcrumb`
	const mainEntityId = (typeof mainEntity === 'object' && mainEntity['@id']) || PERSON_ID

	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebSite',
				'@id': WEBSITE_ID,
				url: SITE_DOMAIN,
				name: SITE_NAME,
				inLanguage: 'en',
				publisher: { '@id': PERSON_ID },
			},
			{
				'@type': type,
				'@id': `${SITE_DOMAIN}${path}#webpage`,
				url,
				name,
				inLanguage: 'en',
				isPartOf: { '@id': WEBSITE_ID },
				about: { '@id': PERSON_ID },
				mainEntity: { '@id': mainEntityId },
				breadcrumb: crumbs.length ? { '@id': breadcrumbId } : undefined,
				dateModified: isoDate(dateModified),
			},
			...(crumbs.length
				? [
						{
							'@type': 'BreadcrumbList' as const,
							'@id': breadcrumbId,
							itemListElement: [{ name: 'Home', path: '/' }, ...crumbs].map((crumb, index) => ({
								'@type': 'ListItem' as const,
								position: index + 1,
								name: crumb.name,
								item: absolute(crumb.path),
							})),
						},
					]
				: []),
			person,
			...(mainEntity ? [mainEntity] : []),
		],
	}
}

export const buildProjectList = (projects: PublishedProject[]): StructuredDataNode => ({
	'@type': 'ItemList',
	'@id': `${SITE_DOMAIN}/projects#list`,
	numberOfItems: projects.length,
	itemListElement: projects.map((project, index) => ({
		'@type': 'ListItem',
		position: index + 1,
		name: project.title,
		url: `${SITE_DOMAIN}/projects/${project.slug}`,
	})),
})

export const buildServiceList = (services: PublishedService[]): StructuredDataNode => ({
	'@type': 'ItemList',
	'@id': `${SITE_DOMAIN}/services#list`,
	numberOfItems: services.length,
	itemListElement: services.map((service, index) => ({
		'@type': 'ListItem',
		position: index + 1,
		item: {
			'@type': 'Service',
			name: service.title,
			description: service.description || undefined,
			serviceType: service.subtitle || undefined,
			image: webUrl(service.imageUrl),
			provider: { '@id': PERSON_ID },
		},
	})),
})

export const buildProject = (project: PublishedProject): StructuredDataNode => {
	const url = `${SITE_DOMAIN}/projects/${project.slug}`
	const image = webUrl(project.heroImageUrl) ?? webUrl(project.imageUrl)

	return {
		'@type': 'CreativeWork',
		'@id': `${url}#project`,
		url,
		name: project.title,
		alternativeHeadline: project.subtitle || undefined,
		description: project.shortDescription || undefined,
		abstract: project.descriptions[0] || undefined,
		image: image ? { '@type': 'ImageObject', url: image, caption: project.title } : undefined,
		genre: project.category || undefined,
		keywords: nonEmpty(unique([...project.tags, ...project.technologies])),
		dateCreated: isoDate(project.startDate),
		datePublished: isoDate(project.publishedAt),
		dateModified: isoDate(project.updatedAt),
		sameAs: nonEmpty([project.liveUrl, project.github].filter(isWebUrl)),
		author: { '@id': PERSON_ID },
		creator: project.role
			? { '@type': 'Role', roleName: project.role, creator: { '@id': PERSON_ID } }
			: { '@id': PERSON_ID },
		mainEntityOfPage: { '@id': `${url}#webpage` },
	}
}
