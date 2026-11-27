import { describe, expect, it } from 'vitest'
import { classNames } from './classNames'

describe('classNames with design tokens', () => {
	it('lets a plain utility replace a token utility of the same kind', () => {
		expect(classNames('h-control-md', 'h-12')).toBe('h-12')
		expect(classNames('size-control-sm', 'size-10')).toBe('size-10')
		expect(classNames('text-body', 'text-lg')).toBe('text-lg')
		expect(classNames('max-w-page', 'max-w-4xl')).toBe('max-w-4xl')
		expect(classNames('shadow-overlay', 'shadow-sm')).toBe('shadow-sm')
	})

	it('keeps a text size and a text color together', () => {
		expect(classNames('text-body', 'text-muted-foreground')).toBe('text-body text-muted-foreground')
	})
})
