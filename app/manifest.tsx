import { MetadataRoute } from 'next'

const ManifestPage = (): MetadataRoute.Manifest => {
	return {
		id: process.env.npm_package_version,
		name: 'Koushik Puppala | Freelancer | Computer Science Engineer',
		short_name: 'Koushik Puppala',
		description:
			"Full-stack developer by day, dreamer by night. I believe that technology has the power to make the world a better place, and I'm committed to using my skills to make that happen.",
		orientation: 'any',
		display: 'fullscreen',
		scope: '/',
		start_url: '/',
		theme_color: '#000000',
		background_color: '#000000',
		display_override: ['window-controls-overlay'],
		icons: [
			{
				src: '/icons/android-chrome-512x512.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'maskable',
			},
			{
				src: '/icons/android-chrome-384x384.png',
				sizes: '384x384',
				type: 'image/png',
				purpose: 'maskable',
			},
			{
				src: '/icons/android-chrome-256x256.png',
				sizes: '256x256',
				type: 'image/png',
				purpose: 'maskable',
			},
			{
				src: '/icons/android-chrome-192x192.png',
				sizes: '192x192',
				type: 'image/png',
				purpose: 'maskable',
			},
			{
				src: '/icons/apple-touch-icon.png',
				sizes: '180x180',
				type: 'image/png',
				purpose: 'any',
			},
			{
				src: '/icons/android-chrome-144x144.png',
				sizes: '144x144',
				type: 'image/png',
				purpose: 'any',
			},
			{
				src: '/icons/favicon-32x32.png',
				sizes: '32x32',
				type: 'image/png',
				purpose: 'maskable',
			},
			{
				src: '/icons/favicon-16x16.png',
				sizes: '16x16',
				type: 'image/png',
				purpose: 'maskable',
			},
		],
		screenshots: [
			{
				src: '/screenshots/desktop.png',
				sizes: '1920x1080',
				type: 'image/png',
			},
			{
				src: '/screenshots/phone.png',
				sizes: '412x915',
				type: 'image/png',
			},
			{
				src: '/screenshots/tablet.png',
				sizes: '800x1280',
				type: 'image/png',
			},
		],
	}
}

export default ManifestPage
