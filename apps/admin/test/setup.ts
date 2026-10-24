import '@testing-library/jest-dom/vitest'
import { server } from './msw'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
afterEach(() => {
	cleanup()
	server.resetHandlers()
})
afterAll(() => server.close())

globalThis.ResizeObserver ??= class {
	observe() {}
	unobserve() {}
	disconnect() {}
}

// jsdom has no matchMedia. Tests set `prefers-color-scheme` through setMediaQuery when they need it.
const mediaQueries = new Map<string, boolean>()

window.matchMedia = (query: string) =>
	({
		matches: mediaQueries.get(query) ?? false,
		media: query,
		onchange: null,
		addEventListener: () => undefined,
		removeEventListener: () => undefined,
		addListener: () => undefined,
		removeListener: () => undefined,
		dispatchEvent: () => false,
	}) as MediaQueryList

Object.assign(globalThis, {
	setMediaQuery: (query: string, matches: boolean) => mediaQueries.set(query, matches),
})
