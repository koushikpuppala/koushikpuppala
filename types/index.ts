import { DocumentActionComponent, DocumentActionDescription, DocumentActionProps, DocumentActionsContext } from 'sanity'

export type { handleFormSubmitType, prevStateType } from './actions'

export type {
	DialogComponentProps,
	MainLayoutProps,
	MotionComponentProps,
	RootLayoutProps,
	SocialMediaLogoComponentProps,
	TransitionComponentProps,
	searchParamsProps,
	globalErrorProps,
} from './app'

export type {
	FlipWordsComponentProps,
	TextGenerateEffectComponentProps,
	CardBodyComponentProps,
	CardComponentProps,
	CardContainerComponentProps,
	CardItemComponentProps,
	ProjectCardComponentProps,
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
