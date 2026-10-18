import type { NextConfig } from 'next'

import { type SentryBuildOptions, withSentryConfig } from '@sentry/nextjs/config'

const nextConfig: NextConfig = {
	reactStrictMode: true,
	cacheComponents: true,
	partialPrefetching: true,
	output: process.env.ENVIRONMENT === 'docker' ? 'standalone' : undefined,
	images: {
		formats: ['image/avif', 'image/webp'],
		minimumCacheTTL: 86400,
		remotePatterns: [{ protocol: 'https', hostname: '**', port: '', pathname: '**' }],
	},
	headers: async () => [
		{
			source: '/:path*',
			headers: [
				{ key: 'X-Frame-Options', value: 'DENY' },
				{ key: 'X-Content-Type-Options', value: 'nosniff' },
				{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
			],
		},
	],
}

const sentryBuildOptions: SentryBuildOptions = {
	org: process.env.SENTRY_ORG,
	project: process.env.SENTRY_ADMIN_PROJECT,
	authToken: process.env.NODE_ENV === 'production' ? process.env.SENTRY_AUTH_TOKEN : undefined,

	debug: false,
	silent: process.env.NODE_ENV !== 'production',

	release:
		process.env.NODE_ENV === 'production' ? { name: process.env.npm_package_version } : undefined,

	widenClientFileUpload: process.env.NODE_ENV === 'production',

	tunnelRoute: process.env.NODE_ENV === 'production' ? '/monitoring' : undefined,

	sourcemaps: {
		disable: process.env.NODE_ENV !== 'production',
		deleteSourcemapsAfterUpload: process.env.NODE_ENV === 'production',
	},

	webpack: {
		treeshake: { removeDebugLogging: process.env.NODE_ENV === 'production' },

		reactComponentAnnotation: { enabled: process.env.NODE_ENV === 'production' },
	},
}

export default withSentryConfig(nextConfig, sentryBuildOptions)
