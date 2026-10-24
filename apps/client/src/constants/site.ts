import { requireEnv } from 'utils/requireEnv'

export const SITE_DOMAIN = requireEnv(
	process.env.NEXT_PUBLIC_DEPLOY_URL,
	'NEXT_PUBLIC_DEPLOY_URL',
).replace(/\/+$/, '')
export const DEFAULT_OG_IMAGE = `${SITE_DOMAIN}/images/projects/Koushikpuppala.webp`
export const SITE_NAME = 'Koushik Puppala'
export const TWITTER_HANDLE = '@puppala_koushik'

export const DEFAULT_KEYWORDS = [
	'Koushik Puppala',
	'Full Stack Developer',
	'Software Engineer',
	'React',
	'Next.js',
	'Node.js',
	'TypeScript',
	'PostgreSQL',
	'AWS',
]
