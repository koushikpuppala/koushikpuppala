import { requireEnv } from 'utils/requireEnv'

// Routes that pass the visitor's IP on call the API directly, because a trip back through the public
// proxy would replace that IP with this server's own and every visitor would share one rate limit.
export const API_INTERNAL_URL = requireEnv(
	process.env.API_INTERNAL_URL,
	'API_INTERNAL_URL',
).replace(/\/+$/, '')
