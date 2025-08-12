import type { RootLayoutProps } from 'types/app'
import type { Metadata } from 'next'

import { SidebarDemo } from 'components/sidebar'
import { Fragment } from 'react'
import { config } from 'config'

export const metadata: Metadata = {
	title: {
		default: 'Koushik Puppala | Software Engineer | Freelancer',
		template: '%s | Koushik Puppala | Software Engineer | Freelancer',
	},
	description:
		"Full-stack developer by day, dreamer by night. Technology can improve the world, and I'm committed to using my skills to make that happen.",
	applicationName: 'Personal Website | Koushik Puppala | Software Engineer | Freelancer',
	keywords: ['Koushik', 'Koushik Puppala', 'Puppala Koushik', 'Koushikpuppala', 'Puppalakoushik'],
	authors: [{ name: 'Koushikpuppala', url: config.deployUrl }],
	creator: 'Koushikpuppala',
	alternates: { canonical: config.deployUrl },
	formatDetection: {
		email: true,
		address: true,
		telephone: true,
		date: true,
		url: true,
	},
	openGraph: {
		title: {
			template: '%s | Koushik Puppala | Software Engineer | Freelancer',
			default: 'Koushik Puppala | Software Engineer | Freelancer',
		},
		description:
			"Full-stack developer by day, dreamer by night. Technology can improve the world, and I'm committed to using my skills to make that happen.",
		url: config.deployUrl,
		type: 'website',
		locale: 'en_IN',
		siteName: 'Koushik Puppala | Software Engineer | Freelancer',
		images: [
			{
				url: '/favicon.ico',
				alt: 'Koushik Puppala | Software Engineer | Freelancer',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: {
			template: '%s | Koushik Puppala | Software Engineer | Freelancer',
			default: 'Koushik Puppala | Software Engineer | Freelancer',
		},
		description:
			"Full-stack developer by day, dreamer by night. Technology can improve the world, and I'm committed to using my skills to make that happen.",
		creator: '@puppala_koushik',
		site: '@puppala_koushik',
		images: {
			url: '/favicon.ico',
			alt: 'Koushik Puppala | Software Engineer | Freelancer',
		},
	},
	category: 'Software Engineer',
	icons: {
		icon: { url: '/favicon.ico', type: 'image/x-icon' },
		shortcut: [
			{ url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
			{ url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
		],
		apple: {
			url: '/icons/apple-touch-icon.png',
			sizes: '180x180',
			type: 'image/png',
		},
	},
	manifest: '/manifest.webmanifest',
	metadataBase: new URL(config.deployUrl),
	robots: {
		index: true,
		follow: true,
		nocache: false,
		googleBot: {
			index: true,
			follow: true,
			noimageindex: false,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
}

const RootLayout = ({ children }: RootLayoutProps) => {
	return (
		<Fragment>
			<SidebarDemo />
			{children}
		</Fragment>
	)
}

export default RootLayout
