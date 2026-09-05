declare namespace NodeJS {
	export interface ProcessEnv {
		readonly NODE_ENV: 'development' | 'production' | 'test'
		readonly ENVIRONMENT?: 'docker' | 'local'
		readonly SENTRY_AUTH_TOKEN?: string
		readonly NEXT_PUBLIC_SENTRY_DSN?: string
		readonly NEXT_PUBLIC_DEPLOY_URL?: string
		readonly NEXT_PUBLIC_API_URL?: string
		readonly NEXT_PUBLIC_GOOGLE_ANALYTICS?: string
		readonly NEXT_PUBLIC_MICROSOFT_CLARITY?: string
		readonly INTERNAL_API_URL?: string
		readonly BACKEND_INTERNAL_URL?: string
		readonly API_URL?: string
	}
}
