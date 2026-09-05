// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

if (process.env.NODE_ENV !== 'development')
	Sentry.init({
		environment: process.env.NODE_ENV,
		dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
		release: process.env.npm_package_version,

		debug: false,
		spotlight: false,
		enableLogs: true,

		tracesSampler: ({ transactionContext, parentSampled }) => {
			if (parentSampled) return 1.0

			const name = transactionContext?.name ?? ''

			if (name === '/health' || name.startsWith('/_next')) return 0

			if (name.startsWith('/admin')) return 1.0

			if (name.includes('auth') || name.includes('session')) return 0.5

			return 0.01
		},

		ignoreTransactions: ['/favicon.ico', '/robots.txt', '/sitemap.xml'],
	})
