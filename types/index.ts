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
	open: boolean
	setOpen: (open: boolean) => void
	cancelButtonRef: React.RefObject<HTMLButtonElement | null>
}

export type {
	AboutSchemaProps,
	EducationSchemaProps,
	ExperienceSchemaProps,
	HomeSchemaProps,
	ProjectSchemaProps,
	ServicesSchemaProps,
} from './schemas'

export type { ContactFormType, ContactModalProps } from './models'

export type {
	FlipWordsComponentProps,
	TextGenerateEffectComponentProps,
	CardBodyComponentProps,
	CardComponentProps,
	CardContainerComponentProps,
	CardItemComponentProps,
} from './components'

export type { handleFormSubmitType, prevStateType } from './actions'
