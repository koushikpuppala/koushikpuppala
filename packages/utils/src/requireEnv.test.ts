import { describe, expect, it } from 'vitest'
import { requireEnv } from './requireEnv'

describe('requireEnv', () => {
	it('returns a set value', () => {
		expect(requireEnv('https://api.example.com', 'NEXT_PUBLIC_BASE_URL')).toBe(
			'https://api.example.com',
		)
	})

	it.each([undefined, ''])('throws with the variable name when the value is %j', value => {
		expect(() => requireEnv(value, 'NEXT_PUBLIC_BASE_URL')).toThrow(
			'Missing environment variable: NEXT_PUBLIC_BASE_URL',
		)
	})
})
