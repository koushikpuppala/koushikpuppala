// @vitest-environment node
import { cacheLife } from 'next/cache'
import { http, HttpResponse } from 'msw'
import { API, server } from '../../test/msw'
import { describe, expect, it } from 'vitest'
import { getFeaturedProjects, getProjectBySlug, getProjectsData } from './projects-data'

const apiProject = {
	id: 'p1',
	slug: 'payments',
	title: 'Payments Platform',
	featured: true,
	status: 'COMPLETED',
	tags: ['fintech'],
	technologies: ['NestJS'],
	startDate: '2024-03-01T00:00:00.000Z',
	thumbnail: { url: 'https://assets.example.com/p1.webp' },
}

describe('projects data', () => {
	it('maps published projects from the API', async () => {
		server.use(
			http.get(`${API}/api/v1/projects/published`, () =>
				HttpResponse.json({ result: [apiProject] }),
			),
		)

		const [project] = await getProjectsData()

		expect(project).toMatchObject({
			id: 'p1',
			slug: 'payments',
			featured: true,
			year: '2024',
			imageUrl: 'https://assets.example.com/p1.webp',
			tags: ['fintech'],
		})
	})

	it('loads images served by this site as local paths, and keeps other hosts as they are', async () => {
		server.use(
			http.get(`${API}/api/v1/projects/published`, () =>
				HttpResponse.json({
					result: [
						{ ...apiProject, thumbnail: { url: 'https://site.test/images/projects/p1.webp' } },
						apiProject,
					],
				}),
			),
		)

		const [local, remote] = await getProjectsData()

		expect(local?.imageUrl).toBe('/images/projects/p1.webp')
		expect(remote?.imageUrl).toBe('https://assets.example.com/p1.webp')
	})

	it('maps the fields the project page reads', async () => {
		server.use(
			http.get(`${API}/api/v1/projects/published/payments`, () =>
				HttpResponse.json({
					result: {
						...apiProject,
						shortDescription: 'Payments, end to end',
						caseStudy: 'How it was built',
						github: 'https://github.com/example/payments',
						updatedAt: '2026-07-28T10:00:00.000Z',
					},
				}),
			),
		)

		const project = await getProjectBySlug('payments')

		expect(project).toMatchObject({
			shortDescription: 'Payments, end to end',
			caseStudy: 'How it was built',
			github: 'https://github.com/example/payments',
			updatedAt: '2026-07-28T10:00:00.000Z',
		})
	})

	it('never invents content when fields are missing', async () => {
		server.use(
			http.get(`${API}/api/v1/projects/published`, () =>
				HttpResponse.json({ result: [{ id: 'p2', slug: 's', title: 'T' }] }),
			),
		)

		const [project] = await getProjectsData()

		expect(project).toMatchObject({ category: '', projectType: '', role: '', year: '' })
	})

	it('returns an empty list, not sample projects, when the API is down', async () => {
		server.use(http.get(`${API}/api/v1/projects/published`, () => HttpResponse.error()))

		await expect(getProjectsData()).resolves.toEqual([])
		await expect(getFeaturedProjects()).resolves.toEqual([])
		expect(cacheLife).toHaveBeenCalledWith('minutes')
	})

	it('returns null for a missing project so the page can 404', async () => {
		server.use(
			http.get(`${API}/api/v1/projects/published/missing`, () =>
				HttpResponse.json({ message: "Project 'missing' not found" }, { status: 404 }),
			),
		)

		await expect(getProjectBySlug('missing')).resolves.toBeNull()
	})
})
