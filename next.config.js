/** @type {import('next').NextConfig} */

const { withSentryConfig } = require('@sentry/nextjs')
const withPWA = require('next-pwa')

const nextConfig = withPWA({
	dest: 'public',
	register: true,
	disable: process.env.NODE_ENV === 'development',
})({
	// reactStrictMode: true,
	swcMinify: true,
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.fallback.fs = false
			require('./scripts/sitemap-generator.js')
		}
		return config
	},
	redirects: async () => {
		return [
			{
				source: '/github/:name',
				destination: 'https://github.com/koushikpuppala/:name',
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
				destination: 'https://discord.com/channels/@me/735813371433058354',
				permanent: true,
			},
			{
				source: '/skype',
				destination: 'https://join.skype.com/invite/vfWLRyA9iFQc',
				permanent: true,
			},
		]
	},
})

const sentryWebpackPluginOptions = {
	silent: true,
}

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions)
