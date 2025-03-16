export const { hostname: DOMAIN } = new URL(
	process.env.NEXT_PUBLIC_DEPLOY_URL?.trim() || 'http://localhost',
)

export const EXPIRES_IN = 60 * 60 * 24 // 1 day

export const COOKIE_NAME = 'token'
