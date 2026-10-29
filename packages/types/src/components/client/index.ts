import type { CSSProperties, ElementType, ReactNode, SubmitEvent } from 'react'
import type { ContactFieldErrors, ContactFormFields, ContactReceipt } from '../../api/index'
import type { MetadataRoute } from 'next'
import type { Graph, Thing } from 'schema-dts'
import type {
	PublishedAbout,
	PublishedEducation,
	PublishedExperience,
	PublishedHome,
	PublishedProject,
	PublishedService,
	PublishedSocial,
} from '../../models/index'

export type SlugPageProps = {
	params: Promise<{ slug: string }>
}

export type SitemapEntry = MetadataRoute.Sitemap[number]

export type RevalidateBody = { tags?: unknown }

export type MetadataPageKey =
	| 'home'
	| 'about'
	| 'experience'
	| 'projects'
	| 'skills'
	| 'services'
	| 'education'
	| 'resume'
	| 'contact'

export type PageDefaults = { title: string; canonicalUrl: string }

export type ResolvedPageMetadata = {
	title: string
	description: string | undefined
	canonical: string
	ogImage: string
	keywords: string[]
	isHome: boolean
	index: boolean
	follow: boolean
}

export type TopicOption = {
	id: string
	label: string
	icon: string
	subject: string
	placeholder: string
}

export type OrbitNode = { label: string; value: string; angle: number }

export type RevealFrom = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade'

export type ProjectVisualVariant = 'flow' | 'lattice' | 'waves' | 'orbit'

export type ArtProps = { rand: () => number; glowId: string }

export type SeededArtProps = Pick<ArtProps, 'rand'>

export type WebVitalsProps = {
	clarityId: string | null
	googleAnalyticsId: string | null
}

export type NavLink = { href: string; label: string }

export type SectionLink = { id: string; label: string }

export type MetaCellProps = { label: string; value: string }

export type RecordRowProps = {
	period: string
	title: string
	meta: string
	detail?: string | null
}

export type LogoLockupProps = {
	className?: string
	showText?: boolean
}

export type ContactViewProps = {
	socials: PublishedSocial[]
	location?: string
}

export type BrandOrbitProps = {
	nodes: OrbitNode[]
	caption?: string
	className?: string
}

export type HeroProps = {
	home: PublishedHome
	socials: PublishedSocial[]
	current?: PublishedExperience
	location?: string
}

export type MetaRowProps = { label: string; value: string }

export type AboutBlockProps = {
	about: PublishedAbout
	current?: PublishedExperience
	education?: PublishedEducation
	showLink?: boolean
	showBio?: boolean
	className?: string
}

export type EducationBlockProps = {
	items: PublishedEducation[]
	className?: string
}

export type TechTickerProps = { services: PublishedService[] }

export type ContactCTAProps = {
	socials: PublishedSocial[]
	email?: string | null
}

export type LeadershipStripProps = { experience: PublishedExperience[] }

export type PageHeroProps = {
	eyebrow: string
	title: string
	lines?: string[]
	lead?: string | null
	meta?: string[]
	actions?: ReactNode
	accentWord?: string
	separator?: string
	className?: string
}

export type TimelineEntryProps = {
	item: PublishedExperience
	index: number
	defaultOpen: boolean
}

export type ExperienceTimelineProps = { items: PublishedExperience[] }

export type TimelineMarkerProps = { current: boolean }

export type TimelinePartProps = { item: PublishedExperience; current: boolean }

export type TimelineAchievementsProps = {
	panelId: string
	achievements: string[]
	defaultOpen: boolean
}

export type SectionRailProps = { sections: SectionLink[] }

export type StackClustersProps = {
	services: PublishedService[]
	className?: string
}

export type FeaturedProjectRowProps = {
	project: PublishedProject
	index: number
	flip?: boolean
	eager?: boolean
}

export type ProjectListRowProps = {
	project: PublishedProject
	index: number
	onEnter?: (project: PublishedProject) => void
	onLeave?: () => void
}

export type SupportingProjectsProps = {
	projects: PublishedProject[]
	startIndex?: number
	className?: string
}

export type RevealProps = {
	children: ReactNode
	className?: string
	delay?: number
	from?: RevealFrom
	as?: ElementType
	style?: CSSProperties
}

export type DisplayLinesProps = {
	lines: string[]
	className?: string
	lineClassName?: string
	startDelay?: number
	step?: number
	accentWord?: string
}

export type MagneticProps = {
	children: ReactNode
	className?: string
	strength?: number
}

export type SpotlightProps = {
	children: ReactNode
	className?: string
	size?: number
	intensity?: number
}

export type MarqueeProps = {
	children: ReactNode
	className?: string
	speed?: number
	reverse?: boolean
}

export type ScrollProgressProps = { className?: string }

export type SectionProps = {
	children: ReactNode
	className?: string
	id?: string
	labelledBy?: string
}

export type SectionHeaderProps = {
	index?: string
	eyebrow: string
	title: ReactNode
	description?: string
	action?: ReactNode
	titleId?: string
	className?: string
	size?: 'md' | 'lg'
}

export type ChipProps = {
	children: ReactNode
	className?: string
	tone?: 'default' | 'signal' | 'outline'
}

export type PulseDotProps = {
	className?: string
	tone?: 'signal' | 'success'
}

export type EmptyStateProps = {
	title: string
	description?: string
	action?: ReactNode
	icon?: ReactNode
}

export type ProjectVisualProps = {
	slug: string
	title: string
	coverImageUrl?: string | null
	index?: string
	className?: string
	eager?: boolean
	frame?: 'cover' | 'wide'
}

export type FilterChipProps = {
	active: boolean
	onClick: () => void
	children: string
}

export type ProjectsViewProps = {
	projects: PublishedProject[]
	socials: PublishedSocial[]
}

export type WordMarkProps = { compact?: boolean }

export type SiteHeaderProps = {
	onOpenMenu: () => void
	onOpenPalette: () => void
}

export type MobileMenuProps = {
	open: boolean
	onClose: () => void
	socials: PublishedSocial[]
}

export type QuickPaletteProps = {
	open: boolean
	onOpenChange: (v: boolean) => void
	socials: PublishedSocial[]
}

export type SiteFooterProps = { socials: PublishedSocial[] }

export type SiteShellProps = {
	children: ReactNode
	socials?: PublishedSocial[]
}

export type PageSkeletonProps = { label: string; children: ReactNode }

export type PageHeroSkeletonProps = { actions?: number }

export type SectionHeaderSkeletonProps = {
	withDescription?: boolean
}

export type SectionSkeletonProps = {
	children: ReactNode
	className?: string
	header?: boolean
}

export type RecordRowsSkeletonProps = { rows?: number }

export type TimelineSkeletonProps = { items?: number }

export type FeaturedRowSkeletonProps = { flip?: boolean }

export type ProjectListSkeletonProps = { rows?: number }

export type StatStripSkeletonProps = { cells?: number }

export type ThemeToggleProps = { className?: string }

export type HeroMetaCellProps = { label: string; value: string; mono?: boolean }

export type HeroLink = { label: string; href: string }

export type HeroEyebrowProps = {
	role: string | undefined
	location: string | undefined
	current: PublishedExperience | undefined
	separator: string | null | undefined
}

export type HeroActionsProps = { primary: HeroLink | null; secondary: HeroLink | null }

export type HeroSocialsProps = { socials: PublishedSocial[] }

export type HeroFactsProps = {
	current: PublishedExperience | undefined
	tenure: string | undefined
	focus: string
}

export type NotFoundViewProps = {
	eyebrow: string
	title: string
	description: string
	primary: NavLink
}

export type ContactField = keyof ContactFormFields

export type ContactFormState = {
	values: ContactFormFields
	change: (field: ContactField, value: string) => void
	blur: (field: ContactField) => void
	selectedTopic: TopicOption | null
	selectTopic: (topic: TopicOption) => void
	errors: ContactFieldErrors
	receipt: ContactReceipt | null
	loading: boolean
	submitError: string | null
	copied: boolean
	copyDraft: () => Promise<void>
	submit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>
	reset: () => void
	captcha: boolean
}

export type ContactFormProps = { form: ContactFormState; directEmail: string | null }

export type ContactIntroProps = { socials: PublishedSocial[]; location?: string | null }

export type ContactReceiptCardProps = { receipt: ContactReceipt; onReset: () => void }

export type DeliveryNoticeProps = {
	error: string
	directEmail: string | null
	values: ContactFormFields
	copied: boolean
	onCopy: () => void
}

export type TopicPickerProps = {
	selected: TopicOption | null
	onSelect: (topic: TopicOption) => void
}

export type ContactInputFieldProps = {
	id: ContactField
	label: string
	error?: string
	required?: boolean
	aside?: ReactNode
	children: ReactNode
}

export type ReceiptRowProps = { label: string; value: string; last?: boolean }

export type ProjectHeroProps = { project: PublishedProject; updated: string | null }

export type ProjectCaseStudyProps = { project: PublishedProject }

export type ProjectDetailsProps = { stack: string[]; tags: string[]; updated: string | null }

export type NextProjectProps = { project: PublishedProject }

// schema.org shapes, so the client builds JSON-LD against the schema without depending on schema-dts.
export type StructuredData = Graph
export type StructuredDataNode = Thing

export type JsonLdProps = { data: StructuredData }

export type PersonGraphInput = {
	home?: PublishedHome
	about?: PublishedAbout
	experience?: PublishedExperience[]
	education?: PublishedEducation[]
	services?: PublishedService[]
	socials?: PublishedSocial[]
}

export type StructuredPageType =
	'ProfilePage' | 'AboutPage' | 'ContactPage' | 'CollectionPage' | 'WebPage'

export type BreadcrumbCrumb = { name: string; path: string }

export type PageGraphInput = {
	path: string
	type: StructuredPageType
	name: string
	person: StructuredDataNode
	mainEntity?: StructuredDataNode
	crumbs?: BreadcrumbCrumb[]
	dateModified?: Date | string | null
}
