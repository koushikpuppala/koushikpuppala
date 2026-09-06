import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	reactStrictMode: true,
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
				{ key: 'X-Frame-Options', value: 'DENY' },
				{ key: 'X-Content-Type-Options', value: 'nosniff' },
				{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
			],
		},
	],
}

export default nextConfig
