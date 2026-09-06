import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ThemeProvider } from '@/lib/theme'
import { AuthProvider } from '@/lib/auth'
import { AdminShell } from '@/components/admin-shell'

export const viewport: Viewport = {
	themeColor: '#090a0f',
	colorScheme: 'dark light',
	width: 'device-width',
	initialScale: 1,
}

export const metadata: Metadata = {
	title: {
		default: 'Content Studio — Koushik Puppala Admin CMS',
		template: '%s — Koushik Puppala CMS',
	},
	description: 'Administrative Content Studio and CMS for koushikpuppala.com',
	robots: { index: false, follow: false },
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en' className='dark' suppressHydrationWarning>
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `(function(){try{var t=localStorage.getItem("kp.admin.theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d);}catch(e){}})();`,
					}}
				/>
			</head>
			<body className='min-h-screen bg-background text-foreground antialiased selection:bg-signal selection:text-white'>
				<ThemeProvider>
					<AuthProvider>
						<AdminShell>{children}</AdminShell>
					</AuthProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
