import { describe, expect, it } from 'vitest'
import { APP_VERSION } from 'config/version'
import { version } from '../../package.json'

describe('APP_VERSION', () => {
	it('is the version in the server package.json', () => {
		expect(APP_VERSION).toBe(version)
		expect(APP_VERSION).toMatch(/^\d+\.\d+\.\d+/)
	})
})
