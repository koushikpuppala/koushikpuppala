import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { findStaticRoutes, toStaticRoute } from './static-routes'

describe('toStaticRoute', () => {
	it('maps page files to URL paths', () => {
		expect(toStaticRoute('page.tsx')).toBe('/')
		expect(toStaticRoute('about/page.tsx')).toBe('/about')
		expect(toStaticRoute('(marketing)/pricing/page.tsx')).toBe('/pricing')
	})

	it('skips dynamic, private and parallel routes', () => {
		expect(toStaticRoute('projects/[slug]/page.tsx')).toBeNull()
		expect(toStaticRoute('docs/[...path]/page.tsx')).toBeNull()
		expect(toStaticRoute('_drafts/page.tsx')).toBeNull()
		expect(toStaticRoute('@modal/login/page.tsx')).toBeNull()
	})
})

describe('findStaticRoutes', () => {
	it('discovers the static routes of this app', async () => {
		const routes = await findStaticRoutes(join(import.meta.dirname, '../../app'))

		expect(routes).toContain('/')
		expect(routes).toContain('/projects')
		expect(routes.some(route => route.includes('['))).toBe(false)
	})
})
