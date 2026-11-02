import { requireEnv } from 'utils/requireEnv'

// Routes that forward the visitor's IP call the API directly, because going through the public
// proxy would replace it with this server's address.
export const API_INTERNAL_URL = requireEnv(
	process.env.API_INTERNAL_URL,
	'API_INTERNAL_URL',
).replace(/\/+$/, '')
