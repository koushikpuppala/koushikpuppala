import createImageUrlBuilder from '@sanity/image-url'
import { FilteredResponseQueryOptions, createClient } from 'next-sanity'
import { config } from '@import/config'
import type { Image } from 'sanity'

export const sanityClient = createClient({
	apiVersion: config.apiVersion,
	dataset: config.dataset,
	projectId: config.projectId,
	useCdn: config.useCdn,
})

const imageBuilder = createImageUrlBuilder({
	projectId: config.projectId,
	dataset: config.dataset,
})

export const urlForImage = (source: Image) => {
	return imageBuilder?.image(source).auto('format').quality(100).fit('max').url()
}

export const sanityQuery = async (query: string, options?: FilteredResponseQueryOptions, params?: any) => {
	try {
		return await sanityClient.fetch(query, params, {
			...options,
			next: {
				revalidate: 300,
			},
		})
	} catch (error) {
		process.env.NODE_ENV === 'development' && console.log('Sanity Query Error:', error)

		throw new Error('Failed to fetch data from Sanity.')
	}
}

export const homeType = '*[_type == "home"][0]'

export const aboutType = '*[_type == "about"][0]'

export const experiencesType = '*[_type == "experience"] | order(startDate desc)'

export const projectsType = '*[_type == "project"] | order(title desc)'
