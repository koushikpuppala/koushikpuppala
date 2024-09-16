import { config } from '@import/config'
import { unstable_cache as cache } from 'next/cache'
import createImageUrlBuilder from '@sanity/image-url'
import { getFile, SanityAssetSource } from '@sanity/asset-utils'
import { FilteredResponseQueryOptions, createClient } from 'next-sanity'
import { REVALIDATION_TIME, SANITY_DOCUMENT_QUERY, SANITY_DOCUMENT_TYPE } from './constant'
import { AboutSchema, ExperienceSchema, HomeSchema, ProjectSchema } from '@import/types'

const sanityClient = createClient({
	apiVersion: config.apiVersion,
	dataset: config.dataset,
	projectId: config.projectId,
	useCdn: config.useCdn,
})

const imageBuilder = createImageUrlBuilder({ projectId: config.projectId, dataset: config.dataset })

const sanityQuery = async <T>(query: string, options?: FilteredResponseQueryOptions, params?: any) => {
	try {
		return await sanityClient.fetch<T>(query, params, options)
	} catch (error) {
		process.env.NODE_ENV === 'development' && console.log('Sanity Query Error:', error)
		throw new Error('Failed to fetch data from Sanity.')
	}
}

export const urlForImage = (source: SanityAssetSource) =>
	imageBuilder?.image(source).auto('format').quality(100).fit('max').url()

export const urlForFile = (source: SanityAssetSource) =>
	getFile(source, { projectId: config.projectId, dataset: config.dataset }).asset.url

export const getHomeDocument = cache(
	() => sanityQuery<HomeSchema>(SANITY_DOCUMENT_QUERY.HOME_DOCUMENT),
	[SANITY_DOCUMENT_TYPE.HOME],
	{ revalidate: REVALIDATION_TIME, tags: [SANITY_DOCUMENT_TYPE.HOME] },
)

export const getAboutDocument = cache(
	() => sanityQuery<AboutSchema>(SANITY_DOCUMENT_QUERY.ABOUT_DOCUMENT),
	[SANITY_DOCUMENT_TYPE.ABOUT],
	{ revalidate: REVALIDATION_TIME, tags: [SANITY_DOCUMENT_TYPE.ABOUT] },
)

export const getResumeDocument = cache(
	() => sanityQuery<AboutSchema['resume']>(SANITY_DOCUMENT_QUERY.RESUME_DOCUMENT),
	[SANITY_DOCUMENT_TYPE.RESUME],
	{ revalidate: REVALIDATION_TIME, tags: [SANITY_DOCUMENT_TYPE.RESUME] },
)
export const getExperienceDocuments = cache(
	() => sanityQuery<ExperienceSchema[]>(SANITY_DOCUMENT_QUERY.EXPERIENCE_DOCUMENTS),
	[SANITY_DOCUMENT_TYPE.EXPERIENCE],
	{ revalidate: REVALIDATION_TIME, tags: [SANITY_DOCUMENT_TYPE.EXPERIENCE] },
)

export const getProjectDocuments = cache(
	() => sanityQuery<ProjectSchema[]>(SANITY_DOCUMENT_QUERY.PROJECT_DOCUMENTS),
	[SANITY_DOCUMENT_TYPE.PROJECT],
	{ revalidate: REVALIDATION_TIME, tags: [SANITY_DOCUMENT_TYPE.PROJECT] },
)
