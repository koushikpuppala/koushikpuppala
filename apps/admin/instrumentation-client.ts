import { init, replayIntegration, captureRouterTransitionStart } from '@sentry/nextjs'

if (process.env.NODE_ENV !== 'development')
	init({
		environment: process.env.NODE_ENV,
		dsn: process.env.NEXT_PUBLIC_ADMIN_SENTRY_DSN,
		release: process.env.npm_package_version,

		debug: false,
		spotlight: false,

		tracesSampleRate: 0.02,

		replaysOnErrorSampleRate: 1.0,
		replaysSessionSampleRate: 0.05,

		integrations: [
			replayIntegration({ maskAllText: true, blockAllMedia: true, stickySession: true }),
		],
	})

export const onRouterTransitionStart = captureRouterTransitionStart
