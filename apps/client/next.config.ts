import { type SentryBuildOptions, withSentryConfig } from '@sentry/nextjs/config'

import nextPWA from '@ducanh2912/next-pwa'
import { requireEnv } from 'utils/requireEnv'

// The image optimizer fetches remote images on the server, so it only accepts the media CDN rather than
// acting as an open proxy for any image on the internet.
const cdn = new URL(requireEnv(process.env.CDN_URL, 'CDN_URL'))

const sentryDsn = process.env.NEXT_PUBLIC_CLIENT_SENTRY_DSN

// Pages stay prerendered, and Next.js inlines its own bootstrap scripts, so scripts keep 'unsafe-inline'.
// The policy still limits which origins can run scripts, receive data or be framed.
const contentSecurityPolicy = [
	"default-src 'self'",
	[
		"script-src 'self' 'unsafe-inline'",
		'https://www.googletagmanager.com',
		'https://www.clarity.ms https://*.clarity.ms',
		'https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/',
		process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : '',
	].join(' '),
	"style-src 'self' 'unsafe-inline'",
	"img-src 'self' blob: data: https:",
	"font-src 'self' data:",
	[
		"connect-src 'self'",
		// Google Analytics 4 collection endpoints, as listed in Google's content security policy guide.
		'https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com',
		'https://*.googletagmanager.com https://*.g.doubleclick.net https://www.google.com',
		'https://*.clarity.ms',
		// Production sends Sentry events through the same-origin /monitoring tunnel; elsewhere they go to the DSN.
		sentryDsn ? new URL(sentryDsn).origin : '',
	].join(' '),
	'frame-src https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/',
	"object-src 'none'",
	"base-uri 'self'",
	"form-action 'self'",
	"frame-ancestors 'none'",
]
	.map(directive => directive.trim())
	.join('; ')

const nextConfig = nextPWA({
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
	partialPrefetching: true,
	outputFileTracingIncludes: { '/sitemap.xml': ['./app/**/page.{js,jsx,ts,tsx,md,mdx}'] },
	reactStrictMode: process.env.NODE_ENV !== 'development',
	output: process.env.ENVIRONMENT === 'docker' ? 'standalone' : undefined,
	images: {
		formats: ['image/avif', 'image/webp'],
		minimumCacheTTL: 86400,
		remotePatterns: [
			{ protocol: 'https', hostname: cdn.hostname, port: cdn.port, pathname: '/**' },
		],
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
					key: 'Content-Security-Policy',
					value: contentSecurityPolicy,
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
		{ source: '/skills', destination: '/services', permanent: true },
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
	org: process.env.SENTRY_ORG,
	project: process.env.SENTRY_CLIENT_PROJECT,
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
		automaticVercelMonitors: process.env.NODE_ENV === 'production',

		treeshake: { removeDebugLogging: process.env.NODE_ENV === 'production' },

		reactComponentAnnotation: { enabled: process.env.NODE_ENV === 'production' },
	},
}

export default withSentryConfig(nextConfig, sentryBuildOptions)
