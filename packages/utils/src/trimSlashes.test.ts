import { describe, expect, it } from 'vitest'
import { trimSlashes } from './trimSlashes'

describe('trimSlashes', () => {
	it('drops leading and trailing slashes', () => {
		expect(trimSlashes('/projects/payments/')).toBe('projects/payments')
		expect(trimSlashes('///')).toBe('')
		expect(trimSlashes('')).toBe('')
	})

	it('collapses repeated slashes inside the path', () => {
		expect(trimSlashes('a//b///c')).toBe('a/b/c')
	})

	it('stays fast on a long run of slashes', () => {
		const started = performance.now()
		trimSlashes(`${'/'.repeat(100_000)}x`)
		expect(performance.now() - started).toBeLessThan(100)
	})
})
