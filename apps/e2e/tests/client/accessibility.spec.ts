import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { CONTENT } from '../../env'

const PAGES = [
	'/',
	'/about',
	'/experience',
	'/education',
	'/projects',
	`/projects/${CONTENT.publishedProject.slug}`,
	'/services',
	'/resume',
	'/contact',
]

// Entrance animations fade text in, and axe measures contrast on whatever opacity it catches mid fade.
test.use({ reducedMotion: 'reduce' })

for (const path of PAGES)
	test(`${path} has no serious accessibility violations`, async ({ page }) => {
		await page.goto(path)
		await page.waitForLoadState('networkidle')

		const { violations } = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
			.analyze()

		const serious = violations
			.filter(violation => violation.impact === 'serious' || violation.impact === 'critical')
			.map(
				violation =>
					`${violation.id}: ${violation.help} → ${violation.nodes
						.slice(0, 4)
						.map(node => `${node.target.join(' ')} ${node.html.slice(0, 160)}`)
						.join(' | ')}`,
			)

		expect(serious).toEqual([])
	})
