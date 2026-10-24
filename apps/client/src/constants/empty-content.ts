import type { PublishedAbout, PublishedHome, PublishedResume } from 'types/models'

export const EMPTY_HOME: PublishedHome = {
	title: '',
	separator: '',
	subtitles: [],
	content: '',
	ctaLabel: '',
	ctaUrl: '',
	secondaryCtaLabel: '',
	secondaryCtaUrl: '',
	featuredSkills: [],
	stats: {},
	profileImageUrl: null,
}

export const EMPTY_ABOUT: PublishedAbout = {
	title: '',
	leadStatement: '',
	content: '',
	biography: '',
	location: '',
	coordinates: '',
	timezone: '',
	status: '',
	highlights: [],
	stats: [],
	ctaLabel: '',
	ctaUrl: '',
}

export const EMPTY_RESUME: PublishedResume = {
	id: '',
	title: '',
	versionName: '',
	fileSize: 0,
	fileSizeFormatted: '',
	fileType: '',
	hasFile: false,
	headline: '',
	summary: '',
	highlights: [],
	competencies: [],
	stats: [],
}
