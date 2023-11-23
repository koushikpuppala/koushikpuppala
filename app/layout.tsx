import { RootLayoutProps } from '@import/interface'
import { Sora } from 'next/font/google'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Koushik Puppala | Freelancer | Computer Science Engineer',
	description:
		'I am a computer science engineer and full-stack developer. I am working on full stack and Discord bot projects.',
	keywords: 'Koushik Puppala, Puppala Koushik, Koushikpuppala, Puppalakoushik',
	alternates: {
		canonical: 'https://koushikpuppala.com',
	},
	viewport: {
		width: 'device-width',
		initialScale: 1,
		maximumScale: 1,
	},
	creator: 'Koushikpuppala',
	icons: {
		icon: { url: '/icons/favicon.ico', type: 'image/x-icon' },
		shortcut: [
			{ url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
			{ url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
		],
		apple: { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
	},
	robots: {
		index: true,
		follow: true,
		nocache: false,
		googleBot: {
			index: true,
			follow: true,
			noimageindex: false,
		},
	},
}

const font = Sora({
	subsets: ['latin', 'latin-ext'],
	variable: '--font-sora',
	weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
})

const RootLayout = ({ children }: RootLayoutProps) => {
	return (
		<html lang='en'>
			<head>
				<meta charSet='utf-8' />
				<meta
					content='text/html; charset=utf-8'
					httpEquiv='Content-Type'
				/>
				<meta
					content='width=device-width, initial-scale=1.0'
					name='viewport'
				/>
			</head>
			<body className={font.className}>{children}</body>
		</html>
	)
}

export default RootLayout
