import { requireEnv } from 'utils/requireEnv'

export const SITE_URL = requireEnv(
	process.env.NEXT_PUBLIC_DEPLOY_URL,
	'NEXT_PUBLIC_DEPLOY_URL',
).replace(/\/+$/, '')
