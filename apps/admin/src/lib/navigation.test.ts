import { describe, expect, it } from 'vitest'
import { breadcrumbsFor, isActivePath } from 'lib/navigation'

describe('navigation', () => {
	it('matches the dashboard only on the root path', () => {
		expect(isActivePath('/', '/')).toBe(true)
		expect(isActivePath('/', '/media')).toBe(false)
		expect(isActivePath('/media', '/media')).toBe(true)
	})

	it('builds breadcrumbs from the navigation sections', () => {
		expect(breadcrumbsFor('/')).toEqual(['Admin', 'Dashboard'])
		expect(breadcrumbsFor('/nowhere')).toEqual(['Admin', 'Content Studio'])
		expect(breadcrumbsFor('/messages').at(-1)).toBeTruthy()
	})
})
