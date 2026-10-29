import {
	addIntegration,
	captureRouterTransitionStart,
	init,
	replayIntegration,
} from '@sentry/nextjs'

if (process.env.NODE_ENV !== 'development')
	init({
		environment: process.env.NODE_ENV,
		dsn: process.env.NEXT_PUBLIC_CLIENT_SENTRY_DSN,
		release: process.env.npm_package_version,

		debug: false,
		spotlight: false,

		tracesSampleRate: 0.02,

		replaysOnErrorSampleRate: 1.0,
		replaysSessionSampleRate: 0.05,
	})

// Replay snapshots the whole page when it starts, so it waits for idle instead of competing with hydration.
// Safari has no requestIdleCallback, so it falls back to a delay.
const startReplay = () =>
	addIntegration(replayIntegration({ maskAllText: true, blockAllMedia: true, stickySession: true }))

if (process.env.NODE_ENV !== 'development') {
	if ('requestIdleCallback' in window) requestIdleCallback(startReplay)
	else setTimeout(startReplay, 3000)
}

export const onRouterTransitionStart = captureRouterTransitionStart
