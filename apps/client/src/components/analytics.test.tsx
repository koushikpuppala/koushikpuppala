import { render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@next/third-parties/google', () => ({
	GoogleAnalytics: ({ gaId }: { gaId: string }) => <span data-testid='ga' data-id={gaId} />,
}))

vi.mock('components/web-vitals', () => ({
	WebVitals: ({
		clarityId,
		googleAnalytics,
	}: {
		clarityId: string | null
		googleAnalytics: boolean
	}) => (
		<span
			data-testid='web-vitals'
			data-clarity={clarityId ?? ''}
			data-ga={String(googleAnalytics)}
		/>
	),
}))

const renderAnalytics = async (env: { ga?: string; clarity?: string }) => {
	vi.stubEnv('NEXT_PUBLIC_GOOGLE_ANALYTICS', env.ga ?? '')
	vi.stubEnv('NEXT_PUBLIC_MICROSOFT_CLARITY', env.clarity ?? '')
	vi.resetModules()
	const { Analytics } = await import('components/analytics')
	return render(<Analytics />)
}

afterEach(() => vi.unstubAllEnvs())

describe('Analytics', () => {
	it('renders nothing when no IDs are set', async () => {
		const { container } = await renderAnalytics({})
		expect(container).toBeEmptyDOMElement()
	})

	it('loads Google Analytics and Clarity with their IDs', async () => {
		const { getByTestId } = await renderAnalytics({ ga: 'G-ABC123XYZ', clarity: 'abc123xyz' })

		expect(getByTestId('ga')).toHaveAttribute('data-id', 'G-ABC123XYZ')
		expect(getByTestId('web-vitals')).toHaveAttribute('data-clarity', 'abc123xyz')
		expect(getByTestId('web-vitals')).toHaveAttribute('data-ga', 'true')
	})

	it('starts Clarity without reporting to Google Analytics when only Clarity is set', async () => {
		const { getByTestId, queryByTestId } = await renderAnalytics({ clarity: 'abc123xyz' })

		expect(queryByTestId('ga')).toBeNull()
		expect(getByTestId('web-vitals')).toHaveAttribute('data-ga', 'false')
	})

	it('ignores IDs that are not in the documented format', async () => {
		const { container } = await renderAnalytics({
			ga: 'G-1"></script><script>alert(1)',
			clarity: 'abc");alert(1);("',
		})
		expect(container).toBeEmptyDOMElement()
	})
})
