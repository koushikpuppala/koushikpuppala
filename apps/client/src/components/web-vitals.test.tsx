import type { NextWebVitalsMetric } from 'next/app'

import { act, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { init, consent, sendGAEvent, report } = vi.hoisted(() => ({
	init: vi.fn(),
	consent: vi.fn(),
	sendGAEvent: vi.fn(),
	report: { callback: null as ((metric: NextWebVitalsMetric) => void) | null },
}))

vi.mock('@microsoft/clarity', () => ({ default: { init, consent } }))
vi.mock('@next/third-parties/google', () => ({
	sendGAEvent,
	GoogleAnalytics: ({ gaId }: { gaId: string }) => <span data-testid='ga' data-id={gaId} />,
}))
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
		render(<WebVitals clarityId='abc123' googleAnalyticsId={null} />)
		expect(init).not.toHaveBeenCalled()

		vi.runAllTimers()

		expect(init).toHaveBeenCalledWith('abc123')
		expect(consent).toHaveBeenCalledWith(true)
	})

	it('does not start Clarity without an ID', () => {
		render(<WebVitals clarityId={null} googleAnalyticsId={null} />)
		vi.runAllTimers()
		expect(init).not.toHaveBeenCalled()
	})

	it('holds Google Analytics until the browser is idle', () => {
		const { queryByTestId } = render(<WebVitals clarityId={null} googleAnalyticsId='G-ABC123XYZ' />)
		expect(queryByTestId('ga')).toBeNull()

		act(() => {
			vi.runAllTimers()
		})

		expect(queryByTestId('ga')).toHaveAttribute('data-id', 'G-ABC123XYZ')
	})

	it('sends Web Vitals reported before the tag loads once it is ready, scaling CLS', () => {
		render(<WebVitals clarityId={null} googleAnalyticsId='G-ABC123XYZ' />)
		report.callback?.(cls)
		expect(sendGAEvent).not.toHaveBeenCalled()

		act(() => {
			vi.runAllTimers()
		})

		expect(sendGAEvent).toHaveBeenCalledWith('event', 'CLS', {
			label: 'v1-cls',
			action: 'CLS',
			non_interaction: true,
			category: 'Web Vitals',
			value: 123,
		})
	})

	it('sends Web Vitals straight away after the tag is ready', () => {
		render(<WebVitals clarityId={null} googleAnalyticsId='G-ABC123XYZ' />)
		act(() => {
			vi.runAllTimers()
		})
		sendGAEvent.mockClear()

		report.callback?.(cls)

		expect(sendGAEvent).toHaveBeenCalledTimes(1)
	})

	it('skips reporting when Google Analytics is off', () => {
		render(<WebVitals clarityId={null} googleAnalyticsId={null} />)
		report.callback?.(cls)
		expect(sendGAEvent).not.toHaveBeenCalled()
	})
})
