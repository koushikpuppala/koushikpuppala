export type RootLayoutProps = {
	children: React.ReactNode
}

export type TransitionComponentProps = RootLayoutProps

export type MainLayoutProps = RootLayoutProps & {
	className?: string
}

export type SocialMediaLogoComponentProps = {
	platform: string
	className: string
}

export type MotionComponentProps = RootLayoutProps & {
	direction: 'left' | 'right' | 'up' | 'down'
	delay: number
	className?: string
}

export type DialogComponentProps = RootLayoutProps & {
	tag: string
}

export type searchParamsProps = {
	searchParams: { [key: string]: string | undefined }
}

export type globalErrorProps = { error: Error & { digest?: string }; reset: () => void }
