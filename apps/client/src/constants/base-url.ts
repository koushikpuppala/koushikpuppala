import { requireEnv } from 'utils/requireEnv'

export const BASE_URL = requireEnv(
	process.env.NEXT_PUBLIC_BASE_URL,
	'NEXT_PUBLIC_BASE_URL',
).replace(/\/+$/, '')
