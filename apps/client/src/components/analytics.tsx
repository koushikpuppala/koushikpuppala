import { WebVitals } from 'components/web-vitals'

const GA_ID_PATTERN = /^G-[A-Z0-9]+$/
const CLARITY_ID_PATTERN = /^[a-z0-9]+$/

const googleAnalyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS
const clarityId = process.env.NEXT_PUBLIC_MICROSOFT_CLARITY

export const Analytics = () => {
	const ga = googleAnalyticsId && GA_ID_PATTERN.test(googleAnalyticsId) ? googleAnalyticsId : null
	const clarity = clarityId && CLARITY_ID_PATTERN.test(clarityId) ? clarityId : null

	if (!ga && !clarity) return null

	return <WebVitals clarityId={clarity} googleAnalyticsId={ga} />
}
