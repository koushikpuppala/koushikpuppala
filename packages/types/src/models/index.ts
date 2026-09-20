export type MediaFile = {
	id: string
	fileName: string
	mimeType: string
	url?: string
	width?: number
	height?: number
	altText?: string
}

export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export type PublishedHome = {
	id?: string
	version?: number
	title: string
	separator: string
	subtitles: string[]
	content: string
	ctaLabel: string
	ctaUrl: string
	secondaryCtaLabel?: string | null
	secondaryCtaUrl?: string | null
	ctas?: Array<{ label: string; href: string; variant?: 'primary' | 'ghost' | 'outline' }>
	stats?: Record<string, unknown> | Array<{ label: string; value: string; detail?: string }> | null
	featuredSkills: string[]
	profileImageId?: string
	profileImageUrl?: string | null
	sortOrder?: number
	isPublished?: boolean
	publishedAt?: Date | string
	createdAt?: Date | string
	updatedAt?: Date | string
	deletedAt?: Date | string | null
	profileImage?: MediaFile
	status?: ContentStatus | string
}

export type AboutStat = {
	label: string
	value: string
	detail?: string
}

export type PublishedAbout = {
	id?: string
	version?: number
	heading?: string
	title: string
	leadStatement: string
	content: string
	bio?: string
	biography: string
	description?: string
	location: string
	coordinates?: string
	timezone?: string
	status?: ContentStatus | string
	profileImageId?: string
	profileImageUrl?: string | null
	highlights: string[]
	skills?: string[]
	values?: string[]
	pillars?: Array<{ title: string; description: string; icon?: string }>
	stats: AboutStat[]
	ctaLabel?: string
	ctaUrl?: string
	sortOrder?: number
	isPublished?: boolean
	publishedAt?: Date | string
	createdAt?: Date | string
	updatedAt?: Date | string
	deletedAt?: Date | string | null
	profileImage?: MediaFile
}

export type PublishedExperience = {
	id: string
	version?: number
	title: string
	role?: string
	company: string
	organization?: string
	location: string
	employmentType: 'FULL_TIME' | 'PART_TIME' | 'INTERN' | 'CONTRACT' | 'FREELANCE' | string
	startDate: string
	endDate?: string | null
	periodFormatted?: string
	isCurrent: boolean
	featured: boolean
	description: string[]
	achievements: string[]
	technologies: string[]
	highlights?: string[]
	website?: string | null
	logoId?: string
	sortOrder: number
	order?: number
	status?: ContentStatus | string
	isPublished?: boolean
	publishedAt?: Date | string
	createdAt?: Date | string
	updatedAt?: Date | string
	deletedAt?: Date | string | null
	logo?: MediaFile
}

export type PublishedEducation = {
	id: string
	version?: number
	degree: string
	fieldOfStudy: string
	field?: string | null
	institution?: string
	university: string
	location: string
	periodFormatted?: string
	startDate: string
	endDate?: string | null
	expectedDate?: Date | string | null
	isCurrent: boolean
	grade?: string | null
	mentor?: string | null
	description: string[]
	achievements: string[]
	focusAreas: string[]
	website?: string | null
	logoId?: string
	sortOrder: number
	order?: number
	status?: ContentStatus | string
	isPublished?: boolean
	publishedAt?: Date | string
	createdAt?: Date | string
	updatedAt?: Date | string
	deletedAt?: Date | string | null
	logo?: MediaFile
}

export type PublishedProjectGalleryItem = {
	id: string
	projectId?: string
	mediaId?: string
	url?: string
	title?: string | null
	description?: string | null
	caption?: string | null
	altText?: string | null
	sortOrder?: number
	order?: number
	media?: MediaFile
}

export type PublishedProject = {
	id: string
	version?: number
	slug: string
	title: string
	subtitle: string
	role?: string
	year?: string
	category: string
	projectType: string
	featured: boolean
	status: 'COMPLETED' | 'IN_PROGRESS' | 'ARCHIVED' | 'DRAFT' | 'PUBLISHED' | string
	shortDescription: string
	summary?: string
	content?: string
	descriptions: string[]
	caseStudy?: string
	tags: string[]
	technologies: string[]
	stack?: string[]
	metrics?: Record<string, unknown>
	startDate?: Date | string
	endDate?: Date | string
	github?: string | null
	repoUrl?: string | null
	liveUrl?: string | null
	imageUrl?: string | null
	heroImageUrl?: string | null
	coverImageUrl?: string | null
	thumbnailId?: string
	heroImageId?: string
	sortOrder: number
	isPublished?: boolean
	publishedAt?: Date | string
	createdAt?: Date | string
	updatedAt?: Date | string
	deletedAt?: Date | string | null
	thumbnail?: MediaFile
	heroImage?: MediaFile
	gallery?: PublishedProjectGalleryItem[]
}

export type PublishedSkill = {
	id: string
	version?: number
	name: string
	category: string
	description?: string
	proficiency?: number
	icon?: string | null
	mediaId?: string
	featured: boolean
	sortOrder: number
	status?: ContentStatus | string
	isPublished?: boolean
	publishedAt?: Date | string
	createdAt?: Date | string
	updatedAt?: Date | string
	deletedAt?: Date | string | null
	media?: MediaFile
}

export type PublishedSkillCluster = {
	id: string
	index: string
	title: string
	categoryTag: string
	description: string
	skills: PublishedSkill[]
}

export type PublishedService = {
	id: string
	version?: number
	title: string
	subtitle?: string
	description: string
	features: string[]
	icon?: string | null
	imageId?: string
	imageUrl?: string | null
	sortOrder: number
	order?: number
	status?: ContentStatus | string
	isPublished?: boolean
	publishedAt?: Date | string
	createdAt?: Date | string
	updatedAt?: Date | string
	deletedAt?: Date | string | null
	image?: MediaFile
}

export type ResumeHighlight = {
	number?: string
	title: string
	description: string
	icon?: string
}

export type ResumeStat = {
	label: string
	value: string
	detail?: string
}

export type PublishedResume = {
	id?: string
	version?: number | string
	versionName?: string
	title?: string
	headline?: string
	summary?: string
	mediaId?: string
	fileId?: string
	fileSize?: number
	fileSizeFormatted?: string
	fileType?: string
	formatLabel?: string
	revisionYear?: string
	lastUpdated?: string
	downloadUrl?: string
	previewUrl?: string
	checksum?: string
	downloads?: number
	highlights?: ResumeHighlight[] | string[]
	competencies?: string[]
	stats?: ResumeStat[] | Record<string, unknown>
	fileUrl?: string
	sortOrder?: number
	status?: ContentStatus | string
	isPublished?: boolean
	isVerified?: boolean
	publishedAt?: Date | string
	createdAt?: Date | string
	updatedAt?: Date | string
	deletedAt?: Date | string | null
	media?: MediaFile
	url?: string
}

export type PublishedSocial = {
	id: string
	version?: number
	url: string
	platform:
		| 'LINKEDIN'
		| 'GITHUB'
		| 'DISCORD'
		| 'TWITTER'
		| 'INSTAGRAM'
		| 'FACEBOOK'
		| 'YOUTUBE'
		| 'EMAIL'
		| 'WEBSITE'
		| string
	label: string
	handle?: string | null
	icon?: string | null
	featured?: boolean
	isVisible?: boolean
	sortOrder: number
	order?: number
	status?: ContentStatus | string
	isPublished?: boolean
	publishedAt?: Date | string
	createdAt?: Date | string
	updatedAt?: Date | string
	deletedAt?: Date | string | null
}

export type PublishedMetadata = {
	id?: string
	version?: number
	type?: 'PAGE' | 'LAYOUT'
	key?: string
	value?: Record<string, unknown>
	title?: string
	description?: string
	ogImage?: string
	canonicalUrl?: string
	robots?: string
	keywords?: string[]
	isPublished?: boolean
	publishedAt?: Date | string
	createdAt?: Date | string
	updatedAt?: Date | string
	deletedAt?: Date | string | null
}

export type AuditLogModel = {
	id: string
	userId?: string | null
	action: string
	entity: string
	entityId?: string | null
	details?: Record<string, unknown> | null
	ipAddress?: string | null
	userAgent?: string | null
	createdAt: Date | string
}

export type ApiMetricModel = {
	id: string
	endpoint: string
	method: string
	statusCode: number
	responseTimeMs: number
	timestamp: Date | string
}

export type ContactModel = {
	id: string
	name: string
	email: string
	subject?: string | null
	message: string
	status: 'UNREAD' | 'READ' | 'REPLIED' | 'ARCHIVED' | string
	createdAt: Date | string
	updatedAt: Date | string
}
