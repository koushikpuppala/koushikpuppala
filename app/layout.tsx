import 'styles/globals.css'

import type { Metadata, Viewport } from 'next'
import type { RootLayoutProps } from 'types/app'

import Script from 'next/script'
import { Sora } from 'next/font/google'
import { classNames } from 'utils/classNames'

export const metadata: Metadata = {
	title: {
		default: 'Koushik Puppala | Software Engineer | Freelancer',
		template: '%s | Koushik Puppala | Software Engineer | Freelancer',
	},
	description:
		"Full-stack developer by day, dreamer by night. Technology can improve the world, and I'm committed to using my skills to make that happen.",
	applicationName: 'Personal Website | Koushik Puppala | Software Engineer | Freelancer',
	keywords: ['Koushik', 'Koushik Puppala', 'Puppala Koushik', 'Koushikpuppala', 'Puppalakoushik'],
	authors: [{ name: 'Koushikpuppala', url: process.env.NEXT_PUBLIC_DEPLOY_URL }],
	creator: 'Koushikpuppala',
	alternates: { canonical: process.env.NEXT_PUBLIC_DEPLOY_URL },
	formatDetection: { email: true, address: true, telephone: true, date: true, url: true },
	openGraph: {
		title: {
			default: 'Koushik Puppala | Software Engineer | Freelancer',
			template: '%s | Koushik Puppala | Software Engineer | Freelancer',
		},
		description:
			"Full-stack developer by day, dreamer by night. Technology can improve the world, and I'm committed to using my skills to make that happen.",
		url: process.env.NEXT_PUBLIC_DEPLOY_URL,
		type: 'website',
		locale: 'en_IN',
		siteName: 'Koushik Puppala | Software Engineer | Freelancer',
		images: [{ url: '/favicon.ico', alt: 'Koushik Puppala | Software Engineer | Freelancer' }],
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
		images: { url: '/favicon.ico', alt: 'Koushik Puppala | Software Engineer | Freelancer' },
	},
	category: 'Software Engineer',
	icons: {
		icon: { url: '/favicon.ico', type: 'image/x-icon' },
		shortcut: [
			{ url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
			{ url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
		],
		apple: { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
	},
	manifest: '/manifest.webmanifest',
	metadataBase: new URL(process.env.NEXT_PUBLIC_DEPLOY_URL),
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

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	themeColor: '#A277FF',
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
				<link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
				<Script
					async={true}
					id='google-analytics-g4'
					strategy='afterInteractive'
					src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
				/>
				<Script
					type='text/javascript'
					id='Google Analytics G4'
					strategy='afterInteractive'
					dangerouslySetInnerHTML={{
						__html: `
							window.dataLayer = window.dataLayer || []
							function gtag() { dataLayer.push(arguments) }
							gtag('js', new Date())
							gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}')
						`,
					}}
				/>
				<Script
					type='text/javascript'
					id='Microsoft Clarity'
					strategy='afterInteractive'
					dangerouslySetInnerHTML={{
						__html: `
							(function (c, l, a, r, i, t, y) {
								c[a] = c[a] ||function () { (c[a].q = c[a].q || []).push(arguments) }
								t = l.createElement(r)
								t.async = 1
								t.src = 'https://www.clarity.ms/tag/' + i
								y = l.getElementsByTagName(r)[0]
								y.parentNode.insertBefore(t, y)
							})(window, document, 'clarity', 'script', '${process.env.NEXT_PUBLIC_MICROSOFT_CLARITY}')
						`,
					}}
				/>
			</head>
			<body
				suppressHydrationWarning
				className={classNames(
					sora.className,
					'relative h-screen w-full overflow-hidden bg-black bg-cover bg-center bg-no-repeat text-white',
				)}>
				{children}
			</body>
		</html>
	)
}

export default RootLayout
