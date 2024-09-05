export type RootLayoutProps = {
	children: React.ReactNode
}

export type TransitionProps = RootLayoutProps

export type MainLayoutProps = RootLayoutProps & {
	className?: string
}

export type SocialMediaLogoProps = {
	platform: string
	className: string
}

export type MotionProps = RootLayoutProps & {
	direction: 'left' | 'right' | 'up' | 'down'
	delay: number
	className?: string
}

export type DialogProps = RootLayoutProps & {
	tag: string
}

export type searchParamsProps = {
	searchParams: { [key: string]: string | undefined }
}

export type globalErrorProps = { error: Error & { digest?: string }; reset: () => void }
