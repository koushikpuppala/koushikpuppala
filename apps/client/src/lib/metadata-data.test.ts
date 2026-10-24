// @vitest-environment node
import { http, HttpResponse } from 'msw'
import { SITE_DOMAIN } from 'constants/site'
import { API, server } from '../../test/msw'
import { describe, expect, it } from 'vitest'
import { resolveMetadataByPath } from 'lib/metadata-data'

const noMetadata = () =>
	server.use(
		http.get(`${API}/api/v1/metadata/by-path`, () =>
			HttpResponse.json({ message: 'not found' }, { status: 404 }),
		),
	)

describe('resolveMetadataByPath', () => {
	it('builds canonical URLs without repeating the path', async () => {
		noMetadata()

		const about = await resolveMetadataByPath('/about')
		const project = await resolveMetadataByPath('/projects/payments')

		expect(about.alternates?.canonical).toBe(`${SITE_DOMAIN}/about`)
		expect(project.alternates?.canonical).toBe(`${SITE_DOMAIN}/projects/payments`)
	})

	it('uses neutral defaults, with no invented description, when the CMS has none', async () => {
		noMetadata()

		const meta = await resolveMetadataByPath('/skills')

		expect(meta.title).toBe('Skills')
		expect(meta.description).toBeUndefined()
	})

	it('prefers metadata from the CMS', async () => {
		server.use(
			http.get(`${API}/api/v1/metadata/by-path`, () =>
				HttpResponse.json({
					result: { key: 'skills', title: 'My Skills', description: 'From the CMS' },
				}),
			),
		)

		const meta = await resolveMetadataByPath('/skills')

		expect(meta).toMatchObject({ title: 'My Skills', description: 'From the CMS' })
	})

	it('ignores the site wide record the API falls back to for a page without its own', async () => {
		server.use(
			http.get(`${API}/api/v1/metadata/by-path`, () =>
				HttpResponse.json({
					result: { key: 'home', title: 'Home title', canonicalUrl: SITE_DOMAIN },
				}),
			),
		)

		const meta = await resolveMetadataByPath('/projects/payments', { title: 'Payments' })

		expect(meta.title).toBe('Payments')
		expect(meta.alternates?.canonical).toBe(`${SITE_DOMAIN}/projects/payments`)
	})

	it('honours noindex set in the CMS', async () => {
		server.use(
			http.get(`${API}/api/v1/metadata/by-path`, () =>
				HttpResponse.json({ result: { key: 'resume', title: 'Resume', robots: 'noindex,follow' } }),
			),
		)

		const meta = await resolveMetadataByPath('/resume')

		expect(meta.robots).toMatchObject({ index: false, follow: true })
	})
})
