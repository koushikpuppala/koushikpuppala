import { RootLayoutProps } from '@import/interface'
import { Sora } from 'next/font/google'
import { Metadata } from 'next'

import '@import/styles/globals.scss'
import { NavbarComponent, TransitionComponent } from '@import/components'
import Script from 'next/script'

export const metadata: Metadata = {
	title: {
		default: 'Koushik Puppala | Freelancer | Computer Science Engineer',
		template: '%s | Koushik Puppala | Freelancer | Computer Science Engineer',
	},
	description:
		'I am a computer science engineer and full-stack developer. I am working on full stack and Discord bot projects.',
	applicationName: 'Koushik Puppala',
	keywords: ['Koushik Puppala', 'Puppala Koushik', 'Koushikpuppala', 'Puppalakoushik'],
	referrer: 'origin-when-cross-origin',
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
			'I am a computer science engineer and full-stack developer. I am working on full stack and Discord bot projects.',
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
			'I am a computer science engineer and full-stack developer. I am working on full stack and Discord bot projects.',
		creator: '@puppala_koushik',
		site: '@puppala_koushik',
		images: {
			url: '/icons/favicon.ico',
			alt: 'Koushik Puppala | Freelancer | Computer Science Engineer',
		},
	},
	category: 'Education',
	verification: {
		google: 'google',
		yandex: 'yandex',
		yahoo: 'yahoo',
	},
	icons: {
		icon: { url: '/icons/favicon.ico', type: 'image/x-icon' },
		shortcut: [
			{ url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
			{ url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
		],
		apple: { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
	},
	manifest: '/main.webmanifest',
	metadataBase: new URL(process.env.NEXT_PUBLIC_VERCEL_URL!),
	robots: {
		index: true,
		follow: true,
		nocache: false,
		googleBot: {
			index: true,
			follow: false,
			noimageindex: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
}

export const viewport = {
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
			<link
				rel='preconnect'
				href='https://www.googletagmanager.com'
				crossOrigin='anonymous'
			/>
			<Script
				id='google-analytics-g4'
				src='https://www.googletagmanager.com/gtag/js?id=G-8NPR1DDE8Y'
				strategy='afterInteractive'
			/>
			<Script
				strategy='afterInteractive'
				id='Google Analytics G4'
				type='text/javascript'
				dangerouslySetInnerHTML={{
					__html: `window.dataLayer = window.dataLayer || [];
			function gtag(){
				dataLayer.push(arguments);
			}
			gtag('js', new Date());
			gtag('config', 'G-8NPR1DDE8Y');`,
				}}
			/>
			<Script
				strategy='afterInteractive'
				id='Google Tag Manager'
				type='text/javascript'
				dangerouslySetInnerHTML={{
					__html: `;(function (w, d, s, l, i) {
				w[l] = w[l] || []
				w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
				var f = d.getElementsByTagName(s)[0],
					j = d.createElement(s),
					dl = l != 'dataLayer' ? '&l=' + l : ''
				j.async = true
				j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl
				f.parentNode.insertBefore(j, f)
			})(window, document, 'script', 'dataLayer', 'GTM-KM9WPPS')`,
				}}
			/>
			<body className={`page relative bg-site bg-cover bg-center bg-no-repeat text-white ${sora.className}`}>
				<noscript
					dangerouslySetInnerHTML={{
						__html: `<iframe src='https://www.googletagmanager.com/ns.html?id=GTM-KM9WPPS' height='0' width='0' style='display:none;visibility:hidden'></iframe>`,
					}}
				/>
				<NavbarComponent />
				<TransitionComponent>{children}</TransitionComponent>
			</body>
		</html>
	)
}

export default RootLayout