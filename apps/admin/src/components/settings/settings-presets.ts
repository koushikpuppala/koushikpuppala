import type { SelectOption } from 'types/components'
import type { PathPreset } from 'types/components/admin'

export const PATHNAME_PRESETS: PathPreset[] = [
	{ key: '/', label: 'Home Page (/)' },
	{ key: '/about', label: 'About (/about)' },
	{ key: '/projects', label: 'Projects (/projects)' },
	{ key: '/projects/[slug]', label: 'Project Detail (/projects/[slug])' },
	{ key: '/experience', label: 'Experience (/experience)' },
	{ key: '/education', label: 'Education (/education)' },
	{ key: '/services', label: 'Services (/services)' },
	{ key: '/resume', label: 'Resume (/resume)' },
	{ key: '/contact', label: 'Contact (/contact)' },
]

export const FORM_KEYS = [...PATHNAME_PRESETS.map(preset => preset.key), 'home', 'global-seo']

export const ROBOTS_OPTIONS: SelectOption<string>[] = [
	{ label: 'index, follow (Standard Public)', value: 'index,follow' },
	{ label: 'noindex, follow (Staging / Pre-launch)', value: 'noindex,follow' },
	{ label: 'noindex, nofollow (Private)', value: 'noindex,nofollow' },
]
