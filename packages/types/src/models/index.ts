export interface UserModel {
	id: string
	firebaseUid: string
	email: string
	displayName: string
	firstName: string
	lastName?: string | null
	photoUrl?: string | null
	provider: 'GOOGLE' | 'GITHUB' | 'PASSWORD'
	role: 'ADMIN' | 'EDITOR' | 'USER'
	status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
	emailVerified: boolean
	lastLoginAt?: Date | string | null
	lastActivityAt?: Date | string | null
	createdAt: Date | string
	updatedAt: Date | string
}

export interface SessionModel {
	id: string
	userId: string
	tokenHash: string
	revoked: boolean
	revokedBy?: string | null
	revokedAt?: Date | string | null
	issuedAt: Date | string
	expiresAt: Date | string
	lastActivityAt?: Date | string | null
	ipAddress?: string | null
	userAgent?: string | null
	createdAt: Date | string
	updatedAt: Date | string
}

export interface MediaModel {
	id: string
	type: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT' | 'OTHER'
	fileName: string
	originalName: string
	size: number
	mimeType: string
	extension: string
	bucket: string
	folder?: string | null
	storageKey: string
	url?: string | null
	width?: number | null
	height?: number | null
	altText?: string | null
	caption?: string | null
	uploadedById?: string | null
	createdAt: Date | string
	updatedAt: Date | string
}

export interface HomeModel {
	id: string
	title: string
	separator: string
	subtitles: string[]
	content: string
	ctaLabel: string
	ctaUrl: string
	secondaryCtaLabel?: string | null
	secondaryCtaUrl?: string | null
	stats?: Record<string, unknown> | null
	featuredSkills: string[]
	profileImageId?: string | null
	profileImage?: MediaModel | null
	sortOrder: number
	isPublished: boolean
	publishedAt?: Date | string | null
	createdAt: Date | string
	updatedAt: Date | string
}

export interface AboutModel {
	id: string
	title: string
	content: string
	biography?: string | null
	profileImageId?: string | null
	profileImage?: MediaModel | null
	highlights: string[]
	skills: string[]
	ctaLabel?: string | null
	ctaUrl?: string | null
	sortOrder: number
	isPublished: boolean
	publishedAt?: Date | string | null
	createdAt: Date | string
	updatedAt: Date | string
}

export interface ExperienceModel {
	id: string
	title: string
	company: string
	location: string
	employmentType: 'FULL_TIME' | 'PART_TIME' | 'INTERN' | 'CONTRACT' | 'FREELANCE'
	startDate: Date | string
	endDate?: Date | string | null
	isCurrent: boolean
	featured: boolean
	description: string[]
	achievements: string[]
	technologies: string[]
	website?: string | null
	logoId?: string | null
	logo?: MediaModel | null
	sortOrder: number
	isPublished: boolean
	publishedAt?: Date | string | null
	createdAt: Date | string
	updatedAt: Date | string
}

export interface EducationModel {
	id: string
	degree: string
	fieldOfStudy: string
	university: string
	location: string
	description: string[]
	achievements: string[]
	startDate: Date | string
	endDate?: Date | string | null
	expectedDate?: Date | string | null
	isCurrent: boolean
	website?: string | null
	logoId?: string | null
	logo?: MediaModel | null
	sortOrder: number
	isPublished: boolean
	publishedAt?: Date | string | null
	createdAt: Date | string
	updatedAt: Date | string
}

export interface ProjectModel {
	id: string
	slug: string
	title: string
	subtitle: string
	category: string
	projectType?: string | null
	featured: boolean
	status: 'COMPLETED' | 'IN_PROGRESS' | 'ARCHIVED'
	shortDescription?: string | null
	descriptions: string[]
	caseStudy?: string | null
	tags: string[]
	technologies: string[]
	metrics?: Record<string, unknown> | null
	startDate?: Date | string | null
	endDate?: Date | string | null
	github?: string | null
	liveUrl?: string | null
	thumbnailId?: string | null
	thumbnail?: MediaModel | null
	heroImageId?: string | null
	heroImage?: MediaModel | null
	gallery?: ProjectGalleryModel[]
	sortOrder: number
	isPublished: boolean
	publishedAt?: Date | string | null
	createdAt: Date | string
	updatedAt: Date | string
}

export interface ProjectGalleryModel {
	projectId: string
	mediaId: string
	title?: string | null
	description?: string | null
	caption?: string | null
	altText?: string | null
	isFeatured: boolean
	isVisible: boolean
	sortOrder: number
	media?: MediaModel
	createdAt: Date | string
}

export interface SkillModel {
	id: string
	name: string
	category: string
	description?: string | null
	proficiency?: number | null
	icon?: string | null
	mediaId?: string | null
	media?: MediaModel | null
	featured: boolean
	sortOrder: number
	isPublished: boolean
	publishedAt?: Date | string | null
	createdAt: Date | string
	updatedAt: Date | string
}

export interface ServiceModel {
	id: string
	title: string
	description: string
	features: string[]
	imageId?: string | null
	image?: MediaModel | null
	sortOrder: number
	isPublished: boolean
	publishedAt?: Date | string | null
	createdAt: Date | string
	updatedAt: Date | string
}

export interface ResumeModel {
	id: string
	title: string
	versionName?: string | null
	mediaId: string
	media?: MediaModel
	fileSize?: number | null
	fileType?: string | null
	checksum?: string | null
	downloads: number
	sortOrder: number
	isPublished: boolean
	publishedAt?: Date | string | null
	createdAt: Date | string
	updatedAt: Date | string
}

export interface SocialModel {
	id: string
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
	url: string
	label?: string | null
	icon?: string | null
	featured: boolean
	isVisible: boolean
	sortOrder: number
	createdAt: Date | string
	updatedAt: Date | string
}

export interface ContactModel {
	id: string
	name: string
	email: string
	subject: string
	message: string
	url?: string | null
	status: 'UNREAD' | 'READ' | 'RESOLVED' | 'ARCHIVED' | 'SPAM'
	priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
	source?: string | null
	internalNotes?: string | null
	assignedToId?: string | null
	assignedTo?: UserModel | null
	readAt?: Date | string | null
	resolvedAt?: Date | string | null
	createdAt: Date | string
	updatedAt: Date | string
}

export interface MetadataModel {
	id: string
	type: 'PAGE' | 'LAYOUT'
	key: string
	value: Record<string, unknown>
	title?: string | null
	description?: string | null
	ogImage?: string | null
	canonicalUrl?: string | null
	keywords: string[]
	isPublished: boolean
	publishedAt?: Date | string | null
	createdAt: Date | string
	updatedAt: Date | string
}

export interface AuditLogModel {
	id: string
	action:
		| 'CREATE'
		| 'UPDATE'
		| 'DELETE'
		| 'PUBLISH'
		| 'UNPUBLISH'
		| 'UPLOAD'
		| 'LOGIN'
		| 'LOGOUT'
	entity: string
	entityId: string
	oldData?: Record<string, unknown> | null
	newData?: Record<string, unknown> | null
	actor: string
	actorId?: string | null
	ipAddress?: string | null
	userAgent?: string | null
	requestId?: string | null
	createdAt: Date | string
}

export interface ApiMetricModel {
	id: string
	ip: string
	method: string
	status: number
	duration: number
	endpoint: string
	requestId: string
	userAgent: string
	userId?: string | null
	error?: string | null
	createdAt: Date | string
}
