import Error from 'next/error'

export type RootLayoutProps = Readonly<{ children: React.ReactNode }>

export type TransitionProps = RootLayoutProps

export type MainLayoutProps = Readonly<RootLayoutProps & { className?: string }>

export type SocialMediaLogoProps = Readonly<{ platform: string; className: string }>

export type MotionProps = RootLayoutProps & {
	direction: 'left' | 'right' | 'up' | 'down'
	delay: number
	className?: string
}

export type DialogProps = Readonly<RootLayoutProps & { handleClose: () => void }>

export type SearchParamsProps = Readonly<{
	searchParams: { [key: string]: string | string[] | undefined }
}>

export type GlobalErrorProps = Readonly<{ error: Error & { digest?: string }; reset: () => void }>
