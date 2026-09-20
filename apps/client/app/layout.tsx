import 'styles/globals.css'

import type { Metadata, Viewport } from 'next'

import {
	DEFAULT_KEYWORDS,
	DEFAULT_OG_IMAGE,
	SITE_DOMAIN,
	TWITTER_HANDLE,
} from 'constants/api-fallback'

import Script from 'next/script'
import { classNames } from 'utils/classNames'
import { Geist, Geist_Mono, Bricolage_Grotesque } from 'next/font/google'

const geistSans = Geist({ variable: '--font-geist-sans', display: 'swap' })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', display: 'swap' })
const bricolageGrotesque = Bricolage_Grotesque({ variable: '--font-bricolage', display: 'swap' })

export const viewport: Viewport = {
	initialScale: 1,
	width: 'device-width',
	colorScheme: 'light dark',
	themeColor: [
		{ media: '(prefers-color-scheme: dark)', color: '#090a0c' },
		{ media: '(prefers-color-scheme: light)', color: '#f7f8f9' },
	],
}

export const metadata: Metadata = {
	metadataBase: new URL(process.env.NEXT_PUBLIC_DEPLOY_URL || SITE_DOMAIN),
	title: {
		default: 'Koushik Puppala — Software Engineer, Full Stack',
		template: '%s — Koushik Puppala',
	},
	description:
		'Portfolio of Koushik Puppala, Full Stack Developer building scalable, high-performance web applications with React, Next.js, Node.js and PostgreSQL.',
	authors: [{ name: 'Koushik Puppala', url: SITE_DOMAIN }],
	creator: 'Koushik Puppala',
	publisher: 'Koushik Puppala',
	keywords: DEFAULT_KEYWORDS,
	alternates: {
		canonical: '/',
	},
	icons: {
		icon: [{ url: '/favicon.png', type: 'image/png' }, { url: '/favicon.ico' }],
		shortcut: '/favicon.png',
		apple: '/favicon.png',
	},
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: SITE_DOMAIN,
		siteName: 'Koushik Puppala',
		title: 'Koushik Puppala — Software Engineer, Full Stack',
		description:
			'End-to-end web features with React, Next.js, Node.js and PostgreSQL. Selected work, experience and stack.',
		images: [
			{
				url: DEFAULT_OG_IMAGE,
				width: 1200,
				height: 630,
				alt: 'Koushik Puppala — Software Engineer, Full Stack',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Koushik Puppala — Software Engineer, Full Stack',
		description:
			'End-to-end web features with React, Next.js, Node.js and PostgreSQL. Selected work, experience and stack.',
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

const RootLayout = ({ children }: LayoutProps<'/'>) => {
	return (
		<html lang='en' className='dark' data-palette='new' suppressHydrationWarning>
			<head>
				<Script id='theme-init' strategy='beforeInteractive'>
					{`(() => {
						const e = document.documentElement

						e.classList.add('js')

						try {
							const s = localStorage.getItem('theme')

							const d = s
								? s === 'dark'
								: !window.matchMedia('(prefers-color-scheme: light)').matches

							e.classList.toggle('dark', d)

							e.style.colorScheme = d ? 'dark' : 'light'
						} catch {}
					})()`}
				</Script>
			</head>
			<body
				className={classNames(
					geistSans.variable,
					geistMono.variable,
					bricolageGrotesque.variable,
					'bg-background text-foreground selection:bg-signal min-h-screen font-sans antialiased selection:text-white',
				)}>
				{children}
			</body>
		</html>
	)
}

export default RootLayout
