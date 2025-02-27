// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

if (process.env.NODE_ENV !== 'development')
	Sentry.init({
		debug: false,
		spotlight: false,
		tracesSampleRate: 0.1,
		replaysSessionSampleRate: 0.1,
		replaysOnErrorSampleRate: 1.0,
		environment: process.env.NODE_ENV,
		dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
		release: process.env.npm_package_version,
		integrations: [Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true, stickySession: true })],
	})
