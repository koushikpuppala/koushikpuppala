/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')
const { withSentryConfig } = require('@sentry/nextjs')

const nextConfig = withPWA({
	reactStrictMode: true,
	swcMinify: true,
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.fallback.fs = false
			require('./scripts/sitemap-generator.js')
		}
		return config
	},
	pwa: {
		dest: 'public',
		register: true,
		skipWaiting: true,
		disable: process.env.NODE_ENV === 'development',
	},
})

const sentryWebpackPluginOptions = {
	silent: true,
}

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions)
