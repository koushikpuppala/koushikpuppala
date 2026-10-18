import type { ChildrenProps } from 'types/components'
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import 'styles/globals.css'
import { ThemeProvider } from 'lib/theme'
import { AuthProvider } from 'lib/auth'
import { AdminShell } from 'components/shell/admin-shell'
import { classNames } from 'utils/classNames'
import { KeyboardFocus } from 'ui/keyboard-focus'

const plusJakartaSans = Plus_Jakarta_Sans({ variable: '--font-jakarta', display: 'swap' })

export const viewport: Viewport = {
	themeColor: [
		{ media: '(prefers-color-scheme: dark)', color: '#090a0c' },
		{ media: '(prefers-color-scheme: light)', color: '#f7f8f9' },
	],
	colorScheme: 'dark light',
	width: 'device-width',
	initialScale: 1,
}

export const metadata: Metadata = {
	title: {
		default: 'Content Studio | Koushik Puppala | Admin',
		template: '%s | Koushik Puppala | Admin',
	},
	description: 'Administrative Content Studio and CMS for koushikpuppala.com',
	robots: {
		index: false,
		follow: false,
		noarchive: true,
		nosnippet: true,
	},
}

const RootLayout = ({ children }: Readonly<ChildrenProps>) => {
	return (
		<html lang='en' className='dark' suppressHydrationWarning>
			<head>
				{/* Applies the saved theme before the first paint so the page never flashes the wrong theme. */}
				<script
					dangerouslySetInnerHTML={{
						__html: `(()=>{try{var t=localStorage.getItem("kp.admin.theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d);}catch(e){}})();`,
					}}
				/>
			</head>
			<body
				suppressHydrationWarning
				className={classNames(
					plusJakartaSans.variable,
					'bg-background text-foreground selection:bg-signal min-h-screen font-sans antialiased selection:text-white',
				)}>
				<KeyboardFocus />
				<ThemeProvider>
					<AuthProvider>
						<AdminShell>{children}</AdminShell>
					</AuthProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}

export default RootLayout
