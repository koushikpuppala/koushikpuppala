import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const css = readFileSync(join(__dirname, 'tokens.css'), 'utf8')

const topLevel = (selector: string) =>
	(css.match(new RegExp(`^${selector.replace('.', '\\.')} \\{[\\s\\S]*?^\\}`, 'gm')) ?? []).join(
		'\n',
	)

const block = (selector: string) => {
	const start = css.indexOf(`${selector} {`)
	if (start === -1) return ''
	let depth = 0
	for (let index = css.indexOf('{', start); index < css.length; index++) {
		if (css[index] === '{') depth++
		if (css[index] === '}' && --depth === 0) return css.slice(start, index + 1)
	}
	return ''
}

const px = (rem: string) => Math.round(parseFloat(rem) * 16)

describe('admin design tokens', () => {
	// covers: AC-1
	it('defines the colors and shadow that differ by theme for both light and dark', () => {
		const light = topLevel(':root')
		const dark = topLevel('.dark')

		for (const token of ['--input', '--overlay-shadow'] as const) {
			expect(light).toContain(`${token}:`)
			expect(dark).toContain(`${token}:`)
		}
	})

	// covers: AC-1
	it('puts the dark theme after the light one so it wins on the same element', () => {
		expect(css.indexOf('.dark {')).toBeGreaterThan(css.indexOf(':root {'))
	})

	// covers: AC-3
	it('has six type steps with the sizes the spec names, none under 12px', () => {
		const sizes = [...css.matchAll(/--text-([a-z]+): ([\d.]+rem);/g)].map(
			match => [match[1], px(match[2] as string)] as const,
		)

		expect(Object.fromEntries(sizes)).toEqual({
			caption: 12,
			small: 13,
			body: 14,
			subheading: 16,
			title: 20,
			headline: 28,
		})
		expect(sizes.every(([, size]) => size >= 12)).toBe(true)
	})

	// covers: AC-3
	it('keeps every step line height above its font size', () => {
		const sizes = Object.fromEntries(
			[...css.matchAll(/--text-([a-z]+): ([\d.]+rem);/g)].map(match => [
				match[1],
				px(match[2] as string),
			]),
		)
		const lines = [...css.matchAll(/--text-([a-z]+)--line-height: ([\d.]+rem);/g)]

		expect(lines).toHaveLength(6)
		for (const match of lines)
			expect(px(match[2] as string)).toBeGreaterThan(sizes[match[1] as string] as number)
	})

	// covers: AC-5
	it('sets a 0.5rem radius and the largest control at 40px', () => {
		expect(topLevel(':root')).toContain('--radius: 0.5rem;')
		expect(css).toMatch(/--spacing-control-lg: 2\.5rem;/)
	})

	// covers: AC-4
	it('styles h1 to h4 with weight 600, tight tracking and a 1.25 line height', () => {
		const rule = css.slice(css.indexOf('@layer base'))

		for (const heading of ['h1', 'h2', 'h3', 'h4']) expect(rule).toContain(heading)
		expect(rule).toContain('font-weight: 600;')
		expect(rule).toContain('letter-spacing: -0.01em;')
		expect(rule).toContain('line-height: 1.25;')
	})

	// covers: AC-1
	it('stops motion for people who ask for reduced motion', () => {
		const reduced = block('@media (prefers-reduced-motion: reduce)')

		expect(reduced).toContain('--duration-fast-raw: 0ms;')
		expect(reduced).toContain('--duration-base-raw: 0ms;')
	})

	// covers: AC-1
	it('orders the layers from sticky up to toast', () => {
		const z = (name: string) =>
			Number(new RegExp(`@utility z-${name} \\{\\s*z-index: (\\d+);`).exec(css)?.[1])

		expect(z('sticky')).toBeLessThan(z('sidebar'))
		expect(z('sidebar')).toBeLessThan(z('overlay'))
		expect(z('overlay')).toBeLessThan(z('toast'))
	})

	// covers: AC-5
	it('points the outline button border at the input border so both stay in step', () => {
		expect(topLevel(':root')).toContain('--outline-border: var(--input);')
	})
})
