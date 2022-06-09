/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: true,
	webpack: (config, { isServer }) => {
		// Fixes npm packages that depend on `fs` module
		if (!isServer) {
			config.resolve.fallback.fs = false
			require('./scripts/sitemap-generator.js')
		}

		return config
	},
}

module.exports = nextConfig
