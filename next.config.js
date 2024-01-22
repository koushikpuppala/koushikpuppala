/** @type {import('next').NextConfig} */

const { withSentryConfig } = require('@sentry/nextjs')
const withPWA = require('@ducanh2912/next-pwa')

const nextConfig = withPWA.default({
	dest: 'public',
	register: true,
	disable: process.env.NODE_ENV === 'development',
	cacheOnFrontEndNav: true,
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
	silent: true,
	org: 'koushikpuppala',
	project: 'koushikpuppala',
}

const sentryOptions = {
	widenClientFileUpload: true,
	transpileClientSDK: true,
	tunnelRoute: '/monitoring',
	hideSourceMaps: true,
	disableLogger: true,
}

module.exports = withSentryConfig(nextConfig, userSentryWebpackPluginOptions, sentryOptions)
