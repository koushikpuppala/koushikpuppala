import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import {
	DEFAULT_KEYWORDS,
	DEFAULT_OG_IMAGE,
	SITE_DOMAIN,
	TWITTER_HANDLE,
} from '../lib/metadata-data'

const bricolageGrotesque = localFont({
	src: './fonts/BricolageGrotesqueVF.woff2',
	variable: '--font-bricolage',
	display: 'swap',
})
const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	display: 'swap',
})
const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	display: 'swap',
})

import { ThemeProvider, PublicHeader } from '../components/navigation'

export const viewport: Viewport = {
	themeColor: '#090d16',
	colorScheme: 'dark',
	width: 'device-width',
	initialScale: 1,
}

export const metadata: Metadata = {
	metadataBase: new URL(process.env.NEXT_PUBLIC_DEPLOY_URL || SITE_DOMAIN),
	title: {
		default: 'Koushik Puppala — Senior Full-Stack & AI Systems Engineer',
		template: '%s | Koushik Puppala',
	},
	description:
		'Personal portfolio and engineering showcase of Koushik Puppala. Architecting distributed backends, performant web applications, and resilient cloud systems.',
	applicationName: 'Koushik Puppala Portfolio',
	authors: [{ name: 'Koushik Puppala', url: SITE_DOMAIN }],
	creator: 'Koushik Puppala',
	publisher: 'Koushik Puppala',
	keywords: DEFAULT_KEYWORDS,
	alternates: {
		canonical: '/',
	},
	icons: {
		icon: '/favicon.ico',
		shortcut: '/favicon.ico',
		apple: '/favicon.ico',
	},
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: SITE_DOMAIN,
		siteName: 'Koushik Puppala',
		title: 'Koushik Puppala — Senior Full-Stack & AI Systems Engineer',
		description:
			'Personal portfolio and engineering showcase of Koushik Puppala. Architecting distributed backends, performant web applications, and resilient cloud systems.',
		images: [
			{
				url: DEFAULT_OG_IMAGE,
				width: 1200,
				height: 630,
				alt: 'Koushik Puppala — Senior Full-Stack & AI Systems Engineer',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Koushik Puppala — Senior Full-Stack & AI Systems Engineer',
		description:
			'Personal portfolio and engineering showcase of Koushik Puppala. Architecting distributed backends, performant web applications, and resilient cloud systems.',
		site: TWITTER_HANDLE,
		creator: TWITTER_HANDLE,
		images: [DEFAULT_OG_IMAGE],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en' className='dark'>
			<body
				className={`${bricolageGrotesque.variable} ${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground selection:bg-signal selection:text-white min-h-screen`}>
				<ThemeProvider defaultTheme='dark'>
					<PublicHeader />
					{children}
				</ThemeProvider>
			</body>
		</html>
	)
}
