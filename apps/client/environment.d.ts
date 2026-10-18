declare namespace NodeJS {
	export interface ProcessEnv {
		readonly NODE_ENV: 'development' | 'production' | 'test'
		readonly ENVIRONMENT?: 'docker' | 'local'
		readonly SENTRY_AUTH_TOKEN?: string
		readonly SENTRY_ORG?: string
		readonly SENTRY_CLIENT_PROJECT?: string
		readonly NEXT_PUBLIC_CLIENT_SENTRY_DSN?: string
		readonly NEXT_PUBLIC_DEPLOY_URL?: string
		readonly NEXT_PUBLIC_BASE_URL?: string
		readonly NEXT_PUBLIC_GOOGLE_ANALYTICS?: string
		readonly NEXT_PUBLIC_MICROSOFT_CLARITY?: string
		readonly NEXT_PUBLIC_RECAPTCHA_SITE_KEY?: string
		readonly REVALIDATE_SECRET?: string
	}
}
