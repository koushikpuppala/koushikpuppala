import * as Sentry from '@sentry/nextjs'

Sentry.init({
	dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
	tracesSampleRate: 1.0,
	debug: process.env.NODE_ENV === 'development',
	replaysOnErrorSampleRate: 1.0,
	replaysSessionSampleRate: 0.1,
	integrations: [
		new Sentry.Replay({
			maskAllText: true,
			blockAllMedia: true,
		}),
	],
	environment: process.env.NODE_ENV,
})
