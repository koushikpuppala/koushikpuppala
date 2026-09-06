import { type SentryBuildOptions, withSentryConfig } from '@sentry/nextjs'

import * as nextPWA from '@ducanh2912/next-pwa'

const nextConfig = nextPWA.default({
	dest: 'public',
	register: process.env.NODE_ENV !== 'development',
	disable: process.env.NODE_ENV === 'development',
	cacheOnFrontEndNav: process.env.NODE_ENV !== 'development',
	aggressiveFrontEndNavCaching: process.env.NODE_ENV !== 'development',
	workboxOptions: {
		disableDevLogs: process.env.NODE_ENV !== 'development',
		cleanupOutdatedCaches: process.env.NODE_ENV !== 'development',
	},
})({
	cacheComponents: true,
	reactStrictMode: process.env.NODE_ENV !== 'development',
	output: process.env.ENVIRONMENT === 'docker' ? 'standalone' : undefined,
	// logging: { browserToTerminal: process.env.NODE_ENV !== 'production' },
	images: {
		formats: ['image/avif', 'image/webp'],
		minimumCacheTTL: 86400,
		remotePatterns: [{ protocol: 'https', hostname: '**', port: '', pathname: '**' }],
	},
	headers: async () => [
		{
			source: '/:path*',
			headers: [
				{
					key: 'X-DNS-Prefetch-Control',
					value: 'on',
				},
				{
					key: 'Strict-Transport-Security',
					value: 'max-age=63072000; includeSubDomains; preload',
				},
				{
					key: 'X-Frame-Options',
					value: 'DENY',
				},
				{
					key: 'X-Content-Type-Options',
					value: 'nosniff',
				},
				{
					key: 'Referrer-Policy',
					value: 'strict-origin-when-cross-origin',
				},
				{
					key: 'Permissions-Policy',
					value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
				},
			],
		},
	],
	rewrites: async () => [
		{
			source: '/__/auth/:params',
			destination: 'https://koushikpuppala.firebaseapp.com/__/auth/:params',
		},
	],
	redirects: async () => [
		{ source: '/github', destination: 'https://github.com/koushikpuppala', permanent: true },
		{
			source: '/github/:params',
			destination: 'https://github.com/koushikpuppala/:params',
			permanent: true,
		},
		{
			source: '/linkedin',
			destination: 'https://www.linkedin.com/in/koushikpuppala',
			permanent: true,
		},
		{ source: '/twitter', destination: 'https://twitter.com/puppala_koushik', permanent: true },
		{
			source: '/instagram',
			destination: 'https://www.instagram.com/koushikpuppala',
			permanent: true,
		},
		{
			source: '/facebook',
			destination: 'https://www.facebook.com/koushikpuppala',
			permanent: true,
		},
		{
			source: '/discord',
			destination: 'https://discordapp.com/users/735813371433058354',
			permanent: true,
		},
		{
			source: '/skype',
			destination: 'https://join.skype.com/invite/vfWLRyA9iFQc',
			permanent: true,
		},
		{ source: '/youtube', destination: 'https://www.youtube.com/@koushikpuppala', permanent: true },
		{ source: '/server', destination: 'https://discord.gg/MsJ99j5Bcv', permanent: true },
		{ source: '/status', destination: 'https://status.koushikpuppala.com/', permanent: true },
	],
})

const sentryBuildOptions: SentryBuildOptions = {
	org: 'koushikpuppala',
	project: 'koushikpuppala',
	authToken: process.env.NODE_ENV === 'production' ? process.env.SENTRY_AUTH_TOKEN : undefined,

	// Logging
	debug: false,
	silent: process.env.NODE_ENV !== 'production',

	// Release tracking
	release:
		process.env.NODE_ENV === 'production' ? { name: process.env.npm_package_version } : undefined,

	// Client bundle upload
	widenClientFileUpload: process.env.NODE_ENV === 'production',

	// Ad-blocker avoidance (prod only)
	tunnelRoute: process.env.NODE_ENV === 'production' ? '/monitoring' : undefined,

	// Sourcemaps (BEST PRACTICE)
	sourcemaps: {
		disable: process.env.NODE_ENV !== 'production',
		deleteSourcemapsAfterUpload: process.env.NODE_ENV === 'production',
	},

	webpack: {
		// Vercel Cron monitoring (prod only)
		automaticVercelMonitors: process.env.NODE_ENV === 'production',

		// Tree-shaking + bundle hygiene
		treeshake: { removeDebugLogging: process.env.NODE_ENV === 'production' },

		// Better React stack traces
		reactComponentAnnotation: { enabled: process.env.NODE_ENV === 'production' },
	},
}

export default withSentryConfig(nextConfig, sentryBuildOptions)
