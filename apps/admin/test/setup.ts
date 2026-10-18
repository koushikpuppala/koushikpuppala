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
