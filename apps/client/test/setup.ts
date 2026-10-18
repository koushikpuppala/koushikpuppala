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
