export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export type Home = {
	id: string
	title: string
	separator: string
	subtitles: string[]
	content: string
	profileImageUrl: string | null
	ctas: Array<{ label: string; href: string; variant?: 'primary' | 'ghost' | 'outline' }>
	status: ContentStatus
	updatedAt: string
}

export type About = {
	id: string
	heading: string
	bio: string
	description: string
	highlights: string[]
	status: ContentStatus
	updatedAt: string
}

export type Experience = {
	id: string
	organization: string
	role: string
	location: string | null
	startDate: string
	endDate: string | null
	description: string
	technologies: string[]
	highlights: string[]
	status: ContentStatus
	order: number
}

export type ProjectGalleryItem = {
	id: string
	projectId?: string
	url: string
	caption: string | null
	order: number
}

export type Project = {
	id: string
	slug: string
	title: string
	summary: string
	content: string
	tags: string[]
	stack: string[]
	repoUrl: string | null
	liveUrl: string | null
	coverImageUrl: string | null
	featured: boolean
	status: ContentStatus
	gallery: ProjectGalleryItem[]
	updatedAt: string
}

export type Education = {
	id: string
	institution: string
	degree: string
	field: string | null
	startDate: string
	endDate: string | null
	grade: string | null
	mentor: string | null
	description: string | null
	status: ContentStatus
	order: number
}

export type Service = {
	id: string
	title: string
	description: string
	icon: string | null
	status: ContentStatus
	order: number
}

export type Resume = {
	id: string
	title: string
	version: string
	fileUrl: string
	summary: string
	updatedAt: string
	status: ContentStatus
}

export type Social = {
	id: string
	platform: string
	label: string
	url: string
	handle: string | null
	order: number
	status: ContentStatus
}
