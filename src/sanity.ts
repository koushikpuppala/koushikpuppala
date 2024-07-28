import { FilteredResponseQueryOptions, createClient } from 'next-sanity'
import { getFile, SanityAssetSource } from '@sanity/asset-utils'
import createImageUrlBuilder from '@sanity/image-url'
import { config } from '@import/config'

export const sanityClient = createClient({
	apiVersion: config.apiVersion,
	dataset: config.dataset,
	projectId: config.projectId,
	useCdn: config.useCdn,
})

const imageBuilder = createImageUrlBuilder({ projectId: config.projectId, dataset: config.dataset })

export const urlForImage = (source: SanityAssetSource) => {
	return imageBuilder?.image(source).auto('format').quality(100).fit('max').url()
}

export const urlForFile = (source: SanityAssetSource) => {
	return getFile(source, { projectId: config.projectId, dataset: config.dataset }).asset.url
}

export const sanityQuery = async (query: string, options?: FilteredResponseQueryOptions, params?: any) => {
	try {
		return await sanityClient.fetch(query, params, { ...options, next: { revalidate: 60 * 60 * 24 } })
	} catch (error) {
		process.env.NODE_ENV === 'development' && console.log('Sanity Query Error:', error)
		throw new Error('Failed to fetch data from Sanity.')
	}
}

export const HOME_DOCUMENT = '*[_type == "home"][0]'

export const ABOUT_DOCUMENT = '*[_type == "about"][0]'

export const EXPERIENCE_DOCUMENTS = '*[_type == "experience"] | order(endDate desc)'

export const PROJECT_DOCUMENTS = '*[_type == "project"] | order(title desc)'
