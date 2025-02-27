// // This file configures the initialization of Sentry on the client.
// // The config you add here will be used whenever a users loads a page in their browser.
// // https://docs.sentry.io/platforms/javascript/guides/nextjs/

// import * as Sentry from '@sentry/nextjs'

// Sentry.init({
// 	enabled: process.env.NODE_ENV === 'production',
// 	dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
// 	release: process.env.npm_package_version,
// 	environment: process.env.NODE_ENV,
// 	replaysOnErrorSampleRate: 1.0,
// 	debug: process.env.NODE_ENV === 'development',
// 	tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
// 	replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
// 	integrations: [Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true, stickySession: true })],
// })
