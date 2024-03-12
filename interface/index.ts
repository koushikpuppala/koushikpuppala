export interface RootLayoutProps {
	children: React.ReactNode
}

export interface TransitionComponentProps extends RootLayoutProps {}

export interface MotionComponentProps extends RootLayoutProps {
	direction: 'left' | 'right' | 'up' | 'down'
	delay: number
	className?: string
}

export interface DialogComponentProps extends RootLayoutProps {
	open: boolean
	setOpen: (open: boolean) => void
	cancelButtonRef: React.MutableRefObject<HTMLButtonElement | null>
}

export * from './constant'
export * from './models'
