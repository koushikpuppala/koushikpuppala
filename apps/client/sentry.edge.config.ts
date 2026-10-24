import { init } from '@sentry/nextjs'

if (process.env.NODE_ENV !== 'development')
	init({
		environment: process.env.NODE_ENV,
		dsn: process.env.NEXT_PUBLIC_CLIENT_SENTRY_DSN,
		release: process.env.npm_package_version,

		debug: false,
		spotlight: false,

		tracesSampler: ({ name, parentSampled }) => {
			if (parentSampled) return 1.0

			if (name === '/health' || name.startsWith('/_next')) return 0

			if (name.includes('auth') || name.includes('session')) return 0.05

			return 0
		},

		ignoreTransactions: ['/favicon.ico', '/robots.txt', '/sitemap.xml'],
	})
