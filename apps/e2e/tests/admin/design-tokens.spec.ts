import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { signIn } from '../../fixtures/admin'

const THEMES = ['light', 'dark'] as const

const TEXT_PAIRS = [
	{ name: 'page title', selector: 'h1' },
	{ name: 'section title', selector: 'h2' },
	{ name: 'muted description', selector: 'header p' },
	{ name: 'swatch caption', selector: 'ul li span.font-medium' },
	{ name: 'table head', selector: '[data-slot=table-head]' },
	{ name: 'table cell', selector: '[data-slot=table-cell]' },
	{ name: 'default button', selector: 'button:has-text("Medium")' },
	{ name: 'destructive button', selector: 'button:has-text("Destructive")' },
	{ name: 'outline button', selector: 'button:has-text("Outline")' },
	{ name: 'success badge', selector: '[data-slot=table-cell] div' },
]

const BORDER_PAIRS = [
	{ name: 'input border', selector: '#design-title' },
	{ name: 'textarea border', selector: '#design-notes' },
	{ name: 'outline button border', selector: 'button:has-text("Outline")' },
]

// Alpha colors are composited over the real backdrop, so the ratio is what a person sees.
const measure = (page: Page, selector: string, kind: 'text' | 'border' | 'outline') =>
	page
		.locator(selector)
		.first()
		.evaluate((element, mode) => {
			const canvas = document.createElement('canvas')
			canvas.width = canvas.height = 1
			const context = canvas.getContext('2d', { willReadFrequently: true })
			if (!context) throw new Error('No canvas context')

			type Color = [number, number, number, number]
			const rgba = (css: string): Color => {
				context.clearRect(0, 0, 1, 1)
				context.fillStyle = '#000'
				context.fillStyle = css
				context.fillRect(0, 0, 1, 1)
				const [r = 0, g = 0, b = 0, a = 255] = context.getImageData(0, 0, 1, 1).data
				return [r, g, b, a / 255]
			}
			const over = (top: Color, bottom: Color): Color => {
				const alpha = top[3] + bottom[3] * (1 - top[3])
				const mix = (t: number, u: number) => (t * top[3] + u * bottom[3] * (1 - top[3])) / alpha
				return [mix(top[0], bottom[0]), mix(top[1], bottom[1]), mix(top[2], bottom[2]), alpha]
			}
			const backdrop = (start: Element | null): Color => {
				let color: Color = [255, 255, 255, 1]
				const chain: Element[] = []
				for (let node = start; node; node = node.parentElement) chain.push(node)
				for (const node of chain.reverse())
					color = over(rgba(getComputedStyle(node).backgroundColor), color)
				return color
			}
			const channel = (value: number) => {
				const s = value / 255
				return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
			}
			const luminance = (c: Color) =>
				0.2126 * channel(c[0]) + 0.7152 * channel(c[1]) + 0.0722 * channel(c[2])
			const ratio = (x: Color, y: Color) => {
				const high = Math.max(luminance(x), luminance(y))
				const low = Math.min(luminance(x), luminance(y))
				return (high + 0.05) / (low + 0.05)
			}

			const style = getComputedStyle(element)
			const parentBackdrop = backdrop(element.parentElement)
			const ownBackdrop = backdrop(element)

			if (mode === 'text') return ratio(over(rgba(style.color), ownBackdrop), ownBackdrop)
			if (mode === 'border')
				return ratio(over(rgba(style.borderTopColor), parentBackdrop), parentBackdrop)
			return ratio(over(rgba(style.outlineColor), parentBackdrop), parentBackdrop)
		}, kind)

for (const theme of THEMES)
	test.describe(`design tokens in ${theme}`, () => {
		test.use({ reducedMotion: 'reduce' })

		test.beforeEach(async ({ page }) => {
			await signIn(page)
			await page.addInitScript(value => localStorage.setItem('kp.admin.theme', value), theme)
			await page.goto('/design')
			await expect(page.getByRole('heading', { level: 1, name: 'Design tokens' })).toBeVisible()
			await expect(page.locator('html')).toHaveClass(theme === 'dark' ? /dark/ : /^(?!.*dark)/)
		})

		test('text meets 4.5:1', async ({ page }) => {
			for (const pair of TEXT_PAIRS)
				expect(await measure(page, pair.selector, 'text'), pair.name).toBeGreaterThanOrEqual(4.5)
		})

		test('control borders meet 3:1', async ({ page }) => {
			for (const pair of BORDER_PAIRS)
				expect(await measure(page, pair.selector, 'border'), pair.name).toBeGreaterThanOrEqual(3)
		})

		test('table rows are 40px', async ({ page }) => {
			const heights = await page
				.locator('[data-slot=table-row]')
				.evaluateAll(rows => rows.map(row => Math.round(row.getBoundingClientRect().height)))
			expect(heights.length).toBeGreaterThan(1)
			for (const height of heights) expect(height).toBeLessThanOrEqual(41)
			for (const height of heights) expect(height).toBeGreaterThanOrEqual(40)
		})

		test('keyboard focus is visible at 3:1', async ({ page }) => {
			const controls = page.locator('main').getByRole('button')
			const total = await controls.count()
			expect(total).toBeGreaterThan(0)

			await page.locator('main').press('Home')
			for (let step = 0; step < total + 2; step++) {
				await page.keyboard.press('Tab')
				const focused = page.locator(':focus-visible')
				if (!(await focused.count())) continue
				const outline = await focused.first().evaluate(element => {
					const style = getComputedStyle(element)
					return { width: parseFloat(style.outlineWidth), style: style.outlineStyle }
				})
				if (outline.style === 'none') continue
				expect(outline.width).toBeGreaterThanOrEqual(2)
				expect(await measure(page, ':focus-visible', 'outline')).toBeGreaterThanOrEqual(3)
			}
		})

		test('has no serious accessibility violations', async ({ page }) => {
			const { violations } = await new AxeBuilder({ page })
				.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
				.analyze()

			const serious = violations
				.filter(item => item.impact === 'serious' || item.impact === 'critical')
				.map(
					item =>
						`${item.id}: ${item.help} → ${item.nodes
							.slice(0, 4)
							.map(node => `${node.target.join(' ')} ${node.html.slice(0, 160)}`)
							.join(' | ')}`,
				)

			expect(serious).toEqual([])
		})
	})

test('an anonymous visit to /design ends on the login page', async ({ page }) => {
	await page.goto('/design')
	await expect(page).toHaveURL(/\/login/)
})
