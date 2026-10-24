import { describe, expect, it } from 'vitest'
import { classNames } from './classNames'

describe('classNames', () => {
	it('joins truthy classes and drops falsy ones', () => {
		expect(classNames('a', false, null, undefined, { b: true, c: false })).toBe('a b')
	})

	it('lets the later Tailwind class win on conflicts', () => {
		expect(classNames('px-2 py-1', 'px-4')).toBe('py-1 px-4')
	})
})
