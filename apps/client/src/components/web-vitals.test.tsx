import type { NextWebVitalsMetric } from 'next/app'

import { render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { init, consent, sendGAEvent, report } = vi.hoisted(() => ({
	init: vi.fn(),
	consent: vi.fn(),
	sendGAEvent: vi.fn(),
	report: { callback: null as ((metric: NextWebVitalsMetric) => void) | null },
}))

vi.mock('@microsoft/clarity', () => ({ default: { init, consent } }))
vi.mock('@next/third-parties/google', () => ({ sendGAEvent }))
vi.mock('next/web-vitals', () => ({
	useReportWebVitals: (callback: (metric: NextWebVitalsMetric) => void) => {
		report.callback = callback
	},
}))

import { WebVitals } from 'components/web-vitals'

const cls: NextWebVitalsMetric = {
	id: 'v1-cls',
	name: 'CLS',
	label: 'web-vital',
	value: 0.1234,
	startTime: 0,
}

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
	vi.useRealTimers()
	vi.clearAllMocks()
})

describe('WebVitals', () => {
	it('starts Clarity with consent once the browser is idle', () => {
		render(<WebVitals clarityId='abc123' googleAnalytics={false} />)
		expect(init).not.toHaveBeenCalled()

		vi.runAllTimers()

		expect(init).toHaveBeenCalledWith('abc123')
		expect(consent).toHaveBeenCalledWith(true)
	})

	it('does not start Clarity without an ID', () => {
		render(<WebVitals clarityId={null} googleAnalytics={false} />)
		vi.runAllTimers()
		expect(init).not.toHaveBeenCalled()
	})

	it('reports Web Vitals to Google Analytics, scaling CLS', () => {
		render(<WebVitals clarityId={null} googleAnalytics />)
		report.callback?.(cls)

		expect(sendGAEvent).toHaveBeenCalledWith('event', 'CLS', {
			label: 'v1-cls',
			action: 'CLS',
			non_interaction: true,
			category: 'Web Vitals',
			value: 123,
		})
	})

	it('skips reporting when Google Analytics is off', () => {
		render(<WebVitals clarityId={null} googleAnalytics={false} />)
		report.callback?.(cls)
		expect(sendGAEvent).not.toHaveBeenCalled()
	})
})
