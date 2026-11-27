import type { NextConfig } from 'next'

import { type SentryBuildOptions, withSentryConfig } from '@sentry/nextjs/config'
import { requireEnv } from 'utils/requireEnv'

const cdn = new URL(requireEnv(process.env.CDN_URL, 'CDN_URL'))
// Seeded media rows keep the public site's own URL, so dev needs that host too.
const devSite =
	process.env.NODE_ENV === 'development'
		? new URL(requireEnv(process.env.NEXT_PUBLIC_DEPLOY_URL, 'NEXT_PUBLIC_DEPLOY_URL'))
		: undefined

const nextConfig: NextConfig = {
	deploymentId: process.env.NEXT_DEPLOYMENT_ID || undefined,
	reactCompiler: true,
	reactStrictMode: true,
	cacheComponents: true,
	partialPrefetching: true,
	experimental: { instantInsights: { validationLevel: 'manual-warning' } },
	output: process.env.ENVIRONMENT === 'docker' ? 'standalone' : undefined,
	images: {
		formats: ['image/avif', 'image/webp'],
		minimumCacheTTL: 86400,
		// The optimizer refuses loopback hosts unless this is on, and only dev serves from one.
		dangerouslyAllowLocalIP: devSite !== undefined,
		remotePatterns: [
			{ protocol: 'https', hostname: cdn.hostname, port: cdn.port, pathname: '/**' },
			...(devSite
				? [
						{
							protocol: devSite.protocol.slice(0, -1) as 'http' | 'https',
							hostname: devSite.hostname,
							port: devSite.port,
							pathname: '/**',
						},
					]
				: []),
		],
	},
	headers: async () => [
		{
			source: '/:path*',
			headers: [
				{ key: 'X-Frame-Options', value: 'DENY' },
				// Firebase signInWithPopup loses its link to the popup (and hangs) without this.
				{ key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
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
