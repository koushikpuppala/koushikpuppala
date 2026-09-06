import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { ThemeProvider } from '@/lib/theme'
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

export const viewport: Viewport = {
	themeColor: '#0a0a0c',
	colorScheme: 'dark',
	width: 'device-width',
	initialScale: 1,
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

/**
 * Runs before first paint: applies the stored theme (no dark-mode flash) and
 * marks the document as JS-capable so the scroll-reveal system may hide
 * content. Without JS nothing is ever hidden, so SEO and no-JS reading are safe.
 */
const themeBootstrap = `(function(){var e=document.documentElement;e.classList.add("js");try{var s=localStorage.getItem("kp.theme");var d=s?s==="dark":!window.matchMedia("(prefers-color-scheme: light)").matches;e.classList.toggle("dark",d);e.style.colorScheme=d?"dark":"light";var p=localStorage.getItem("kp.palette");e.setAttribute("data-palette",p==="old"?"old":"new");}catch(x){}})();`

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en' className='dark' data-palette='new' suppressHydrationWarning>
			<head>
				{/* biome-ignore lint/security/noDangerouslySetInnerHtml: static inline theme and JS detection bootstrap script */}
				<script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
			</head>
			<body
				className={`${bricolageGrotesque.variable} ${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground selection:bg-signal selection:text-white min-h-screen`}>
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	)
}
