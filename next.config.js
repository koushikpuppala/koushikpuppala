/** @type {import('next').NextConfig} */

const { withSentryConfig } = require('@sentry/nextjs')
const withPWA = require('next-pwa')

const nextConfig = withPWA({
	dest: 'public',
	register: true,
	disable: process.env.NODE_ENV === 'development',
})({
	reactStrictMode: process.env.NODE_ENV !== 'development',
	redirects: async () => {
		return [
			{
				source: '/github',
				destination: 'https://github.com/koushikpuppala',
				permanent: false,
			},
			{
				source: '/github/:params',
				destination: 'https://github.com/koushikpuppala/:params',
				permanent: false,
			},
			{
				source: '/linkedin',
				destination: 'https://www.linkedin.com/in/koushikpuppala',
				permanent: false,
			},
			{
				source: '/twitter',
				destination: 'https://twitter.com/puppala_koushik',
				permanent: false,
			},
			{
				source: '/instagram',
				destination: 'https://www.instagram.com/koushikpuppala',
				permanent: false,
			},
			{
				source: '/facebook',
				destination: 'https://www.facebook.com/puppalakoushik',
				permanent: false,
			},
			{
				source: '/discord',
				destination: 'https://discordapp.com/users/735813371433058354',
				permanent: false,
			},
			{
				source: '/skype',
				destination: 'https://join.skype.com/invite/vfWLRyA9iFQc',
				permanent: false,
			},
			{
				source: '/youtube',
				destination: 'https://www.youtube.com/@koushikpuppala',
				permanent: false,
			},
			{
				source: '/server',
				destination: 'https://discord.gg/MsJ99j5Bcv',
				permanent: false,
			},
			{
				source: '/status',
				destination: 'https://status.koushikpuppala.com/',
				permanent: false,
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
