import '@testing-library/jest-dom/vitest'
import { server } from './msw'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'

vi.mock('next/cache', () => ({ cacheLife: vi.fn(), cacheTag: vi.fn(), revalidateTag: vi.fn() }))

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
afterEach(() => {
	cleanup()
	server.resetHandlers()
	vi.clearAllMocks()
})
afterAll(() => server.close())

// jsdom has no layout or observers. These stand ins let components mount; tests that care about a
// media query or an element scrolling into view drive them through the helpers below.
if (typeof window !== 'undefined') {
	const queries = new Map<string, boolean>()

	window.matchMedia = (query: string) =>
		({
			matches: queries.get(query) ?? false,
			media: query,
			onchange: null,
			addEventListener: () => undefined,
			removeEventListener: () => undefined,
			addListener: () => undefined,
			removeListener: () => undefined,
			dispatchEvent: () => false,
		}) as MediaQueryList

	Object.assign(globalThis, {
		setMediaQuery: (query: string, matches: boolean) => queries.set(query, matches),
	})

	const observed = new Set<[IntersectionObserverCallback, Element]>()

	globalThis.IntersectionObserver = class {
		readonly root = null
		readonly rootMargin = ''
		readonly thresholds = []
		constructor(private readonly callback: IntersectionObserverCallback) {}
		observe(target: Element) {
			observed.add([this.callback, target])
		}
		unobserve(target: Element) {
			for (const entry of observed) if (entry[1] === target) observed.delete(entry)
		}
		disconnect() {}
		takeRecords() {
			return []
		}
	} as unknown as typeof IntersectionObserver

	Object.assign(globalThis, {
		intersectAll: () => {
			for (const [callback, target] of observed)
				callback(
					[{ isIntersecting: true, target } as unknown as IntersectionObserverEntry],
					{} as IntersectionObserver,
				)
		},
	})

	globalThis.ResizeObserver ??= class {
		observe() {}
		unobserve() {}
		disconnect() {}
	}

	window.scrollTo = (() => undefined) as typeof window.scrollTo
	Element.prototype.scrollIntoView = () => undefined
}
