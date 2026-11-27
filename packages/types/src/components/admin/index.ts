import type {
	ChangeEvent,
	ComponentType,
	Dispatch,
	HTMLAttributes,
	ReactNode,
	SetStateAction,
	SubmitEvent,
} from 'react'
import type {
	AuditLogItem,
	ContactMessage,
	FetchResult,
	HealthStatusData,
	ListResult,
} from '../../api/index'
import type { AuthStage, SessionUser } from '../../auth/index'
import type { UserRole, UserStatus } from '../../enums/index'
import type { UserRecord } from '../../api/users'
import type {
	AboutStat,
	Education,
	MetadataRecord,
	Experience,
	PickedMedia,
	Project,
	Service,
	Social,
} from '../../models/index'
import type { ClassNameProps } from '../ui/index'

export type PublishState = 'PUBLISHED' | 'DRAFT'

export type WithPublishState<T> = T & { status?: PublishState }

export type ExperienceRow = WithPublishState<Experience>
export type EducationRow = WithPublishState<Education>
export type ServiceRow = WithPublishState<Service>
export type SocialRow = WithPublishState<Social>

export type ProjectRow = Omit<Project, 'status'> & {
	status?: PublishState
	lifecycle?: Project['status']
}

export type FilterMap = Record<string, string | ((value: string) => [param: string, value: string])>

export type ListQueryOptions = {
	sort?: Record<string, string>
	filters?: FilterMap
}

export type ReadableParams = Pick<URLSearchParams, 'get'>

export type ItemOf<R> = R extends ListResult<infer T> ? T : never

export type ListFetcher<R> = (
	query: URLSearchParams,
	signal: AbortSignal,
) => Promise<FetchResult<R>>

export type MediaLibraryOptions = {
	enabled?: boolean
	type?: string
}

export type Identified = { id: string }

export type Theme = 'dark' | 'light'

export type ThemeContextValue = {
	theme: Theme
	toggleTheme: () => void
	setTheme: (t: Theme) => void
}

export type IconComponent = ComponentType<ClassNameProps>

export type NavItem = {
	href: string
	label: string
	icon: IconComponent
}

export type NavSection = {
	group: string | null
	items: NavItem[]
}

export type CommandItem = {
	id: string
	label: string
	category: string
	icon: IconComponent
	action: () => void
	shortcut?: string
}

export type CommandPaletteProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
}

export type StepState = 'done' | 'active' | 'waiting'

export type BootStepProps = { state: StepState; label: string }

export type StudioBootProps = { stage: AuthStage }

export type BadgeVariant =
	'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive' | 'signal'

export type BadgeProps = HTMLAttributes<HTMLDivElement> & { variant?: BadgeVariant }

export type DialogProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	children: ReactNode
}

export type DialogIdsValue = { titleId: string; descriptionId: string }

export type DialogContentProps = {
	className?: string
	children: ReactNode
	onClose?: () => void
	role?: 'dialog' | 'alertdialog'
	'aria-label'?: string
}

export type FormErrorProps = { message: string | null }

export type CollectionColumn<T> = {
	key: string
	header: string
	render?: (item: T) => ReactNode
	className?: string
	sortable?: boolean
}

export type CollectionItem = { id: string; status?: string }

export type CollectionManagerProps<T extends CollectionItem> = {
	title: string
	description?: string
	items: T[]
	totalCount: number
	columns: CollectionColumn<T>[]
	loading?: boolean
	error?: string | null
	onRetry?: () => void
	onCreate?: () => void
	onEdit?: (item: T) => void
	onDelete?: (item: T) => void | Promise<void>
	onTogglePublish?: (item: T) => void | Promise<void>
	createLabel?: string
	actionsExtra?: (item: T) => ReactNode
}

export type ConfirmDialogProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	title: string
	description: string
	confirmLabel?: string
	cancelLabel?: string
	variant?: 'destructive' | 'default' | 'signal'
	loading?: boolean
	onConfirm: () => void | Promise<void>
}

export type MediaPickerModalProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	onSelect: (media: PickedMedia) => void
	title?: string
}

export type SingletonEditorProps = {
	title: string
	description?: string
	isDirty?: boolean
	loading?: boolean
	skeleton?: ReactNode
	saving?: boolean
	error?: string | null
	onRetry?: () => void
	onSave: () => void | Promise<void>
	onDiscard?: () => void
	isPublished?: boolean
	onTogglePublish?: () => void | Promise<void>
	publishing?: boolean
	canPublish?: boolean
	children: ReactNode
}

export type PublishButtonProps = {
	isPublished: boolean
	publishing: boolean
	isDirty: boolean
	disabled: boolean
	onClick: () => void | Promise<void>
}

export type SaveButtonProps = {
	saving: boolean
	disabled: boolean
	onClick: () => void | Promise<void>
}

export type EditorErrorProps = { error: string; onRetry?: () => void }

export type FormDialogBaseProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
}

export type EducationFormDialogProps = FormDialogBaseProps & {
	education: Partial<EducationRow> | null
	onSave: (edu: Partial<EducationRow>) => Promise<void>
}

export type ExperienceFormDialogProps = FormDialogBaseProps & {
	experience: Partial<ExperienceRow> | null
	onSave: (exp: Partial<ExperienceRow>) => Promise<void>
}

export type ProjectFormDialogProps = FormDialogBaseProps & {
	project: Partial<ProjectRow> | null
	onSave: (p: Partial<Project>) => Promise<void>
}

export type ServiceFormDialogProps = FormDialogBaseProps & {
	service: Partial<ServiceRow> | null
	onSave: (svc: Partial<ServiceRow>) => Promise<void>
}

export type SocialFormDialogProps = FormDialogBaseProps & {
	social: Partial<SocialRow> | null
	onSave: (soc: Partial<SocialRow>) => Promise<void>
}

export type UserCreateDialogProps = FormDialogBaseProps & {
	onCreated: (user: UserRecord) => void
}

export type UserEditDialogProps = {
	user: UserRecord | null
	onClose: () => void
	onUpdated: (id: string, role: UserRole, status: UserStatus) => void
}

export type FieldRow = { key: string; label: string; before?: unknown; after?: unknown }

export type DisplayValue =
	| { kind: 'empty' }
	| { kind: 'text'; text: string; mono?: boolean }
	| { kind: 'json'; text: string }

export type AuditSide = 'before' | 'after'

export type ActionStyle = { variant: BadgeVariant; verb: string }

export type ActionBadgeProps = { action: string; className?: string }

export type ValueProps = { value: unknown }

export type SideProps = { tone: AuditSide; value: unknown }

export type ChangeListProps = { rows: FieldRow[] }

export type FieldListProps = { rows: FieldRow[]; side: AuditSide }

export type SectionProps = { title: string; meta?: string; children: ReactNode }

export type DetailProps = { label: string; children: ReactNode }

export type RecordBodyProps = { log: AuditLogItem }

export type AuditLogDialogProps = {
	log: AuditLogItem | null
	onClose: () => void
}

export type RecentContact = Pick<
	ContactMessage,
	'id' | 'name' | 'email' | 'subject' | 'createdAt' | 'status'
>

export type RecentAudit = Pick<AuditLogItem, 'id' | 'actor' | 'action' | 'entity' | 'createdAt'>

export type HealthRowProps = {
	icon: ReactNode
	label: string
	state: boolean | null
	detail?: string
	last?: boolean
}

export type SingletonLayout = 'home' | 'about' | 'resume'

export type FieldRowLayout = number | 'tall'

export type SingletonFieldLayout = ReadonlyArray<FieldRowLayout | ReadonlyArray<FieldRowLayout>>

export type PageHeaderSkeletonProps = { actions?: number }

export type StatCardsSkeletonProps = { count?: number; className?: string }

export type TableSkeletonProps = { rows?: number; columns?: number; filters?: number }

export type FieldSkeletonProps = { tall?: boolean }

export type FormFieldsSkeletonProps = {
	rows: FieldRowLayout[]
}

export type LabelledProps = { label: string; children: ReactNode }

export type SingletonFormSkeletonProps = { layout: SingletonLayout }

export type SingletonSkeletonProps = { layout: SingletonLayout; label: string }

export type ListSkeletonProps = { label: string; columns?: number }

export type FormDialogOptions<T, P = Partial<T>> = {
	open: boolean
	record: Partial<T> | null
	empty: Partial<T>
	normalize?: (record: Partial<T>) => Partial<T>
	toPayload: (form: Partial<T>) => P
	onSave: (payload: P) => Promise<void>
	onOpenChange: (open: boolean) => void
}

export type FormDialogState<T> = {
	form: Partial<T>
	setForm: Dispatch<SetStateAction<Partial<T>>>
	setField: <K extends keyof T>(key: K, value: T[K]) => void
	saving: boolean
	saveError: string | null
	submit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>
}

export type FormDialogProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	title: string
	description: string
	error: string | null
	saving: boolean
	submitLabel: string
	onSubmit: (event: SubmitEvent<HTMLFormElement>) => void
	className?: string
	aside?: ReactNode
	children: ReactNode
}

export type FieldProps = {
	id?: string
	label: string
	required?: boolean
	error?: string
	variant?: 'form' | 'editor'
	className?: string
	children: ReactNode
}

export type StringListFieldProps = {
	label: string
	items: string[] | null | undefined
	onChange: (items: string[]) => void
	placeholder: string
	variant?: 'rows' | 'chips'
	chipVariant?: BadgeVariant
}

export type CheckboxFieldProps = {
	label: string
	checked: boolean | null | undefined
	onChange: (checked: boolean) => void
	className?: string
}

export type PublishStateSelectProps = {
	id: string
	value: PublishState | undefined
	onChange: (value: PublishState) => void
	className?: string
}

export type MediaFieldProps = {
	label: string
	url: string | null | undefined
	alt: string
	buttonLabel: string
	onPick: () => void
	hint?: string
	variant?: 'compact' | 'large'
}

export type SingletonRecord = { id?: string; isPublished?: boolean | null }

export type SingletonActions<R> = {
	get: () => Promise<FetchResult<R>>
	save: (id: string | undefined, payload: object) => Promise<FetchResult<R>>
	togglePublish: (id: string) => Promise<FetchResult<R>>
}

export type SingletonEditorOptions<T extends SingletonRecord, R> = {
	actions: SingletonActions<R>
	empty: T
	fromRecord: (record: R) => T
	toPayload: (content: T) => object
	merge?: (content: T, saved: R) => T
	validate?: (content: T) => string | null
	label: string
	loadError: string
	saveError: string
}

export type SingletonEditorState<T> = {
	content: T
	change: <K extends keyof T>(key: K, value: T[K]) => void
	update: (updater: (content: T) => T) => void
	loading: boolean
	saving: boolean
	publishing: boolean
	error: string | null
	setError: (error: string | null) => void
	isDirty: boolean
	notice: string | null
	setNotice: (notice: string | null) => void
	reload: () => Promise<void>
	discard: () => void
	save: () => Promise<void>
	togglePublish: () => Promise<void>
}

export type NoticeProps = { message: string | null }

export type AboutStatsFieldProps = {
	stats: AboutStat[]
	onChange: (stats: AboutStat[]) => void
}

export type ResumeFileCardProps = {
	fileUrl: string
	downloadFileName?: string
	downloads: number
	uploading: boolean
	onUpload: (event: ChangeEvent<HTMLInputElement>) => void
}

export type CollectionViewOptions<R extends ListResult<unknown>, Row extends CollectionItem, P> = {
	list: ListFetcher<R>
	listOptions: ListQueryOptions
	toRow: (item: ItemOf<R>) => Row
	save: (id: string | undefined, data: P) => Promise<FetchResult<unknown>>
	remove: (id: string) => Promise<FetchResult<unknown>>
	togglePublish: (row: Row) => Promise<FetchResult<unknown>>
}

export type CollectionViewState<Row extends CollectionItem, P> = {
	manager: Pick<
		CollectionManagerProps<Row>,
		| 'items'
		| 'totalCount'
		| 'loading'
		| 'error'
		| 'onRetry'
		| 'onCreate'
		| 'onEdit'
		| 'onDelete'
		| 'onTogglePublish'
	>
	dialog: {
		open: boolean
		onOpenChange: (open: boolean) => void
		record: Row | null
		onSave: (data: P) => Promise<void>
	}
}

export type DashboardBlockState<T> = {
	status: 'loading' | 'ready' | 'error'
	data: T | null
	error: string | null
	refreshing: boolean
}

export type DashboardBlock<T> = DashboardBlockState<T> & { reload: () => void }

export type ProjectTotals = { total: number; published: number }

export type ContactSummary = { total: number; unread: number; recent: RecentContact[] }

export type AuditSummary = { total: number; recent: RecentAudit[] }

export type HealthSnapshot = { health: HealthStatusData; checkedAt: Date }

export type DashboardBlocks = {
	projects: DashboardBlock<ProjectTotals>
	contacts: DashboardBlock<ContactSummary>
	media: DashboardBlock<number>
	audits: DashboardBlock<AuditSummary>
	health: DashboardBlock<HealthSnapshot>
}

export type AttentionItem = {
	id: string
	label: string
	count?: number
	href: string
	tone: 'signal' | 'destructive'
}

export type AttentionSource = 'contacts' | 'projects'

export type AttentionState = {
	items: AttentionItem[]
	loading: number
	unavailable: AttentionSource[]
	clear: boolean
}

export type DashboardHeaderProps = {
	displayName: string
	email: string
	refreshing: boolean
	onRefresh: () => void
	children?: ReactNode
}

export type DashboardPanelProps = {
	title: string
	icon: ReactNode
	action?: ReactNode
	footer?: ReactNode
	status: DashboardBlockState<unknown>['status']
	refreshing: boolean
	errorLabel: string
	onRetry: () => void
	skeleton: ReactNode
	children: ReactNode
}

export type StatCardProps = {
	label: string
	icon: ReactNode
	status: DashboardBlockState<unknown>['status']
	value: number | null
	badge?: ReactNode
	href: string
	linkLabel: string
}

export type AttentionStripProps = { state: AttentionState }

export type RecentInquiriesProps = { block: DashboardBlock<ContactSummary> }

export type RecentMutationsProps = { block: DashboardBlock<AuditSummary> }

export type HealthPanelProps = { block: DashboardBlock<HealthSnapshot> }

export type HealthRowsProps = {
	api: boolean | null
	database: boolean | null
	redis: boolean | null
	apiDetail?: string
}

export type DashboardCardsProps = { blocks: DashboardBlocks }

export type MetadataForm = {
	id: string | null
	key: string
	title: string
	description: string
	canonicalUrl: string
	ogImage: string
	robots: string
	keywords: string[]
	isPublished: boolean
}

export type PathPreset = { key: string; label: string }

export type MetadataFormState = {
	form: MetadataForm
	setField: <K extends keyof MetadataForm>(key: K, value: MetadataForm[K]) => void
	routeRecords: MetadataRecord[]
	populate: (record: MetadataRecord) => void
	selectPath: (key: string) => void
	loading: boolean
	loadedOnce: boolean
	fetchError: string | null
	saving: boolean
	saved: boolean
	saveError: string
	save: (event: SubmitEvent<HTMLFormElement>) => Promise<void>
	reload: () => void
}

export type MetadataFieldsProps = {
	form: MetadataForm
	setField: MetadataFormState['setField']
}

export type PathnamePickerProps = MetadataFieldsProps & {
	routeRecords: MetadataRecord[]
	onSelect: (key: string) => void
}

export type OpenGraphCardProps = MetadataFieldsProps & { onPick: () => void }

export type SettingsHeaderProps = {
	saved: boolean
	saving: boolean
	refreshing: boolean
	onRefresh: () => void
}

export type MetadataTableProps = {
	items: MetadataRecord[]
	loading: boolean
	total: number
	onLoad: (record: MetadataRecord) => void
}

export type SwitchProps = {
	checked: boolean
	onChange: (checked: boolean) => void
	label: string
}

export type PageHeaderProps = {
	title: string
	description: string
	children?: ReactNode
}

export type RefreshButtonProps = { loading: boolean; onClick: () => void; disabled?: boolean }

export type ErrorBannerProps = { message: string; onRetry?: () => void }

export type CountCardProps = {
	label: string
	value: ReactNode
	loaded: boolean
	valueClassName?: string
	indicator?: boolean
}

export type MessageDialogProps = {
	message: ContactMessage | null
	onClose: () => void
	onSaved: () => void
	onDelete: (message: ContactMessage) => void
}

export type ValueBadgeProps = { value: string }

export type BadgeStyle = { variant: BadgeVariant; label: string }

export type UploadButtonProps = {
	accept: string
	uploading: boolean
	onChange: (event: ChangeEvent<HTMLInputElement>) => void
	label: string
	size?: 'sm' | 'default'
}

export type ServiceTileTone = 'ok' | 'warn' | 'down' | 'info'

export type ServiceTileProps = {
	icon: ReactNode
	label: string
	value: string
	detail: string
	tone: ServiceTileTone
	valueClassName?: string
}

export type AutoRefreshToggleProps = { active: boolean; onToggle: () => void }

export type NavLinksProps = {
	pathname: string
	variant: 'sidebar' | 'drawer'
	onNavigate?: () => void
}

export type MobileNavProps = {
	pathname: string
	onClose: () => void
	onSignOut: () => void
}

export type TopBarProps = {
	pathname: string
	menuOpen: boolean
	onOpenMenu: () => void
	onOpenPalette: () => void
}

export type UserMenuProps = { user: SessionUser | null; onSignOut: () => void }

export type SidebarProps = { pathname: string }

export type DesignSwatch = { name: string; swatchClassName: string; note?: string }

export type DesignTextStep = {
	name: string
	size: string
	className: string
}

export type DesignRadiusStep = { name: string; className: string }

export type DesignControlStep = { name: string; height: string; className: string }

export type DesignSectionProps = { title: string; description: string; children: ReactNode }

export type DesignRow = { id: string; name: string; status: string; count: number }
