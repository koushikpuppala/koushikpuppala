export interface RootLayoutProps {
	children: React.ReactNode
}

export interface TransitionComponentProps extends RootLayoutProps {}

export interface MotionComponentProps extends RootLayoutProps {
	direction: 'left' | 'right' | 'up' | 'down'
	delay: number
	className?: string
}
