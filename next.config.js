/** @type {import('next').NextConfig} */

const { withSentryConfig } = require('@sentry/nextjs')
const withPWA = require('@ducanh2912/next-pwa')

const nextConfig = withPWA.default({
	dest: 'public',
	register: true,
	disable: process.env.NODE_ENV === 'development',
	cacheOnFrontEndNav: true,
	aggressiveFrontEndNavCaching: true,
	workboxOptions: {
		disableDevLogs: true,
		cleanupOutdatedCaches: true,
	},
})({
	redirects: async () => {
		return [
			{
				source: '/github',
				destination: 'https://github.com/koushikpuppala',
				permanent: true,
			},
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
			{
				source: '/twitter',
				destination: 'https://twitter.com/puppala_koushik',
				permanent: true,
			},
			{
				source: '/instagram',
				destination: 'https://www.instagram.com/koushikpuppala',
				permanent: true,
			},
			{
				source: '/facebook',
				destination: 'https://www.facebook.com/puppalakoushik',
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
			{
				source: '/youtube',
				destination: 'https://www.youtube.com/@koushikpuppala',
				permanent: true,
			},
			{
				source: '/server',
				destination: 'https://discord.gg/MsJ99j5Bcv',
				permanent: true,
			},
			{
				source: '/status',
				destination: 'https://status.koushikpuppala.com/',
				permanent: true,
			},
		]
	},
})

const userSentryWebpackPluginOptions = {
	// For all available options, see:
	// https://github.com/getsentry/sentry-webpack-plugin#options

	// Suppresses source map uploading logs during build
	silent: true,
	org: 'koushikpuppala',
	project: 'koushikpuppala',
}

const sentryOptions = {
	// For all available options, see:
	// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

	// Upload a larger set of source maps for prettier stack traces (increases build time)
	widenClientFileUpload: true,

	// Transpiles SDK to be compatible with IE11 (increases bundle size)
	transpileClientSDK: true,

	// Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
	tunnelRoute: '/monitoring',

	// Hides source maps from generated client bundles
	hideSourceMaps: true,

	// Automatically tree-shake Sentry logger statements to reduce bundle size
	disableLogger: true,

	// Enables automatic instrumentation of Vercel Cron Monitors.
	// See the following for more information:
	// https://docs.sentry.io/product/crons/
	// https://vercel.com/docs/cron-jobs
	automaticVercelMonitors: true,
}

module.exports = withSentryConfig(nextConfig, userSentryWebpackPluginOptions, sentryOptions)
