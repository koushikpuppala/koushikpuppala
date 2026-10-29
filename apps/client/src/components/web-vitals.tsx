'use client'

import type { NextWebVitalsMetric } from 'next/app'
import type { WebVitalsProps } from 'types/components/client'
import { useEffect, useRef, useState } from 'react'
import Clarity from '@microsoft/clarity'
import { useReportWebVitals } from 'next/web-vitals'
import { GoogleAnalytics, sendGAEvent } from '@next/third-parties/google'

// Safari has no requestIdleCallback, so it falls back to a delay.
const whenIdle = (start: () => void) => {
	if ('requestIdleCallback' in window) {
		const handle = requestIdleCallback(start)
		return () => cancelIdleCallback(handle)
	}

	const handle = setTimeout(start, 3000)
	return () => clearTimeout(handle)
}

const sendMetric = (metric: NextWebVitalsMetric) =>
	sendGAEvent('event', metric.name, {
		label: metric.id,
		action: metric.name,
		non_interaction: true,
		category: metric.label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
		value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
	})

export const WebVitals = ({ clarityId, googleAnalyticsId }: WebVitalsProps) => {
	const [analyticsReady, setAnalyticsReady] = useState(false)
	const pending = useRef<NextWebVitalsMetric[]>([])

	// Both tags start when the browser is idle so they do not compete with the first render.
	useEffect(() => {
		if (!clarityId) return

		return whenIdle(() => {
			Clarity.init(clarityId)
			Clarity.consent(true)
		})
	}, [clarityId])

	useEffect(() => {
		if (!googleAnalyticsId) return

		return whenIdle(() => setAnalyticsReady(true))
	}, [googleAnalyticsId])

	useEffect(() => {
		if (!analyticsReady) return

		// The tag's own init script runs later, so create the queue it will pick up before sending.
		Reflect.set(window, 'dataLayer', Reflect.get(window, 'dataLayer') ?? [])
		pending.current.splice(0).forEach(sendMetric)
	}, [analyticsReady])

	useReportWebVitals(metric => {
		if (!googleAnalyticsId) return

		if (analyticsReady) sendMetric(metric)
		else pending.current.push(metric)
	})

	return analyticsReady && googleAnalyticsId ? <GoogleAnalytics gaId={googleAnalyticsId} /> : null
}
