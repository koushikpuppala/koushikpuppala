import { DocumentActionComponent, DocumentActionDescription, DocumentActionProps, DocumentActionsContext } from 'sanity'

export type { handleFormSubmitType, prevStateType } from './actions'

export type {
	DialogProps,
	MainLayoutProps,
	MotionProps,
	RootLayoutProps,
	SocialMediaLogoProps,
	TransitionProps,
	searchParamsProps,
	globalErrorProps,
} from './app'

export type {
	FlipWordsProps,
	TextGenerateEffectProps,
	CardBodyProps,
	CardProps,
	CardContainerProps,
	CardItemProps,
	ProjectCardProps,
	BackgroundBeamsProps,
} from './components'

export type { ContactFormType, ContactModalProps } from './models'

export type {
	AboutSchema,
	EducationSchema,
	ExperienceSchema,
	HomeSchema,
	ProjectSchema,
	ServicesSchema,
} from './schemas'

export type BetterAction = (props: DocumentActionProps) => DocumentActionDescription | null

export type SanityImprovedAction = (
	originalAction: DocumentActionComponent,
	context: DocumentActionsContext,
) => DocumentActionComponent
