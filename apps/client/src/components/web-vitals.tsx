'use client'

import type { WebVitalsProps } from 'types/components/client'
import { useEffect } from 'react'
import Clarity from '@microsoft/clarity'
import { useReportWebVitals } from 'next/web-vitals'
import { sendGAEvent } from '@next/third-parties/google'

export const WebVitals = ({ clarityId, googleAnalytics }: WebVitalsProps) => {
	useEffect(() => {
		if (!clarityId) return

		const start = () => {
			Clarity.init(clarityId)
			Clarity.consent(true)
		}

		// Start Clarity when the browser is idle so it does not compete with the first render.
		// Safari has no requestIdleCallback, so it falls back to a delay.
		if ('requestIdleCallback' in window) {
			const handle = requestIdleCallback(start)
			return () => cancelIdleCallback(handle)
		}

		const handle = setTimeout(start, 3000)
		return () => clearTimeout(handle)
	}, [clarityId])

	useReportWebVitals(metric => {
		if (!googleAnalytics) return

		sendGAEvent('event', metric.name, {
			label: metric.id,
			action: metric.name,
			non_interaction: true,
			category: metric.label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
			value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
		})
	})

	return null
}
