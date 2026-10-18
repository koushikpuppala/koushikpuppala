import type { EmploymentType, MetadataType, ProjectStatus, SocialPlatform } from '../enums/index'

export type MediaFile = {
	id: string
	fileName: string
	originalName?: string
	storageKey?: string
	mimeType?: string
	size?: number
	url?: string | null
	width?: number | null
	height?: number | null
	altText?: string | null
	caption?: string | null
	createdAt?: string
}

export type MediaAsset = MediaFile & { url: string }

export type PickedMedia = { id: string; url: string; fileName: string; altText?: string }

export type UploadedMedia = { id: string; url: string; storageKey: string; fileName: string }

export type PresignedUpload = { uploadUrl: string; storageKey: string; url: string }

export type PublishedHome = {
	id?: string
	title: string
	separator: string
	subtitles: string[]
	content: string
	ctaLabel: string
	ctaUrl: string
	secondaryCtaLabel?: string | null
	secondaryCtaUrl?: string | null
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
}

export type AboutValue = { title: string; description: string }

export type AboutPillar = { title: string; description: string; icon?: string }

export type AboutStat = {
	label: string
	value: string
	detail?: string
}

export type PublishedAbout = {
	id?: string
	title: string
	leadStatement: string
	content: string
	biography: string
	location: string
	coordinates?: string
	timezone?: string
	status?: string
	profileImageId?: string
	profileImageUrl?: string | null
	highlights: string[]
	skills?: string[]
	values?: string[]
	pillars?: AboutPillar[]
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
	title: string
	organization: string
	location: string
	employmentType: EmploymentType
	startDate: string
	endDate?: string | null
	periodFormatted?: string
	isCurrent: boolean
	featured: boolean
	description: string[]
	achievements: string[]
	technologies: string[]
	website?: string | null
	logoId?: string
	sortOrder: number
	isPublished?: boolean
	publishedAt?: Date | string
	createdAt?: Date | string
	updatedAt?: Date | string
	deletedAt?: Date | string | null
	logo?: MediaFile
}

export type PublishedEducation = {
	id: string
	degree: string
	fieldOfStudy: string
	university: string
	location: string
	periodFormatted?: string
	startDate: string
	endDate?: string | null
	expectedDate?: Date | string | null
	isCurrent: boolean
	description: string[]
	achievements: string[]
	focusAreas: string[]
	website?: string | null
	logoId?: string
	sortOrder: number
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
	media?: MediaFile
}

export type PublishedProject = {
	id: string
	slug: string
	title: string
	subtitle: string
	role?: string
	year?: string
	category: string
	projectType: string
	featured: boolean
	status: ProjectStatus
	shortDescription: string
	descriptions: string[]
	caseStudy?: string | null
	tags: string[]
	technologies: string[]
	metrics?: Record<string, unknown>
	startDate?: Date | string
	endDate?: Date | string
	github?: string | null
	liveUrl?: string | null
	imageUrl?: string | null
	heroImageUrl?: string | null
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

export type PublishedService = {
	id: string
	title: string
	subtitle?: string
	description: string
	features: string[]
	icon?: string | null
	imageId?: string
	imageUrl?: string | null
	sortOrder: number
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
	versionName?: string
	title?: string
	headline?: string
	summary?: string
	mediaId?: string
	fileSize?: number
	fileSizeFormatted?: string
	fileType?: string
	downloadUrl?: string
	previewUrl?: string
	checksum?: string
	downloads?: number
	highlights?: ResumeHighlight[] | string[]
	competencies?: string[]
	stats?: ResumeStat[] | Record<string, unknown>
	sortOrder?: number
	isPublished?: boolean
	publishedAt?: Date | string
	createdAt?: Date | string
	updatedAt?: Date | string
	deletedAt?: Date | string | null
	media?: MediaFile
}

export type PublishedSocial = {
	id: string
	url: string
	platform: SocialPlatform
	label: string | null
	handle?: string | null
	icon?: string | null
	featured?: boolean
	isVisible?: boolean
	sortOrder: number
	createdAt?: Date | string
	updatedAt?: Date | string
	deletedAt?: Date | string | null
}

export type PublishedMetadata = {
	id?: string
	type?: MetadataType
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

export type MetadataRecord = {
	id?: string
	type: MetadataType
	key: string
	value: Record<string, unknown>
	title?: string | null
	description?: string | null
	ogImage?: string | null
	canonicalUrl?: string | null
	robots?: string | null
	keywords: string[]
	isPublished: boolean
	createdAt?: string
	updatedAt?: string
}

export type HomeContent = PublishedHome
export type AboutContent = PublishedAbout
export type Experience = PublishedExperience
export type Education = PublishedEducation
export type Project = PublishedProject
export type Service = PublishedService
export type ResumeRecord = PublishedResume
export type Social = PublishedSocial
