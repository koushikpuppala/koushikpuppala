import Script from 'next/script'
import classNames from 'classnames'
import { Sora } from 'next/font/google'
import { config } from '@import/config'
import { Metadata, Viewport } from 'next'
import { RootLayoutProps } from '@import/types'
import { BackgroundBeamsComponent, NavbarComponent } from '@import/components'

import '@import/styles/globals.scss'
import 'react-vertical-timeline-component/style.min.css'

export const metadata: Metadata = {
	title: {
		default: 'Koushik Puppala | Freelancer | Computer Science Engineer',
		template: '%s | Koushik Puppala | Freelancer | Computer Science Engineer',
	},
	description:
		"Full-stack developer by day, dreamer by night. Technology can improve the world, and I'm committed to using my skills to make that happen.",
	applicationName: 'Personal Website | Koushik Puppala | Freelancer | Computer Science Engineer',
	keywords: ['Koushik', 'Koushik Puppala', 'Puppala Koushik', 'Koushikpuppala', 'Puppalakoushik'],
	authors: [
		{
			name: 'Koushikpuppala',
			url: 'http://koushikpuppala.com',
		},
	],
	creator: 'Koushikpuppala',
	alternates: {
		canonical: 'https://koushikpuppala.com',
	},
	formatDetection: {
		email: true,
		address: true,
		telephone: true,
		date: true,
		url: true,
	},
	openGraph: {
		title: {
			template: '%s | Koushik Puppala | Freelancer | Computer Science Engineer',
			default: 'Koushik Puppala | Freelancer | Computer Science Engineer',
		},
		description:
			"Full-stack developer by day, dreamer by night. Technology can improve the world, and I'm committed to using my skills to make that happen.",
		url: 'http://koushikpuppala.com',
		type: 'website',
		locale: 'en_IN',
		siteName: 'Koushik Puppala | Freelancer | Computer Science Engineer',
		images: [
			{
				url: '/icons/favicon.ico',
				alt: 'Koushik Puppala | Freelancer | Computer Science Engineer',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: {
			template: '%s | Koushik Puppala | Freelancer | Computer Science Engineer',
			default: 'Koushik Puppala | Freelancer | Computer Science Engineer',
		},
		description:
			"Full-stack developer by day, dreamer by night. Technology can improve the world, and I'm committed to using my skills to make that happen.",
		creator: '@puppala_koushik',
		site: '@puppala_koushik',
		images: {
			url: '/icons/favicon.ico',
			alt: 'Koushik Puppala | Freelancer | Computer Science Engineer',
		},
	},
	category: 'Software Engineer',
	icons: {
		icon: { url: '/icons/favicon.ico', type: 'image/x-icon' },
		shortcut: [
			{ url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
			{ url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
		],
		apple: { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
	},
	manifest: '/manifest.webmanifest',
	metadataBase: new URL(process.env.NEXT_PUBLIC_DEPLOY_URL!),
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

export const revalidate = 300

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	themeColor: '#915EFF5A',
}

const sora = Sora({
	subsets: ['latin', 'latin-ext'],
	weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
})

const RootLayout = ({ children }: RootLayoutProps) => {
	return (
		<html lang='en'>
			<head>
				<link rel='preconnect' href='https://www.googletagmanager.com' crossOrigin='anonymous' />
				<link rel='preconnect' href='https://analytics.google.com' crossOrigin='anonymous' />
				<Script
					id='google-analytics-g4'
					async={true}
					src={`https://www.googletagmanager.com/gtag/js?id=${config.googleAnalytics}`}
					strategy='afterInteractive'
				/>
				<Script
					strategy='afterInteractive'
					id='Google Analytics G4'
					type='text/javascript'
					dangerouslySetInnerHTML={{
						__html: `window.dataLayer = window.dataLayer || [];
							function gtag() {
								dataLayer.push(arguments);
							}
							gtag('js', new Date());
							gtag('config', '${config.googleAnalytics}');`,
					}}
				/>
			</head>
			<body
				className={classNames(
					sora.className,
					'relative h-screen w-full overflow-hidden bg-black bg-cover bg-center bg-no-repeat text-white',
				)}>
				<NavbarComponent />
				{/* <TransitionComponent></TransitionComponent> */}
				{children}
				<BackgroundBeamsComponent />
			</body>
		</html>
	)
}

export default RootLayout
