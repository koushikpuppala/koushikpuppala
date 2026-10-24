declare namespace NodeJS {
	export interface ProcessEnv {
		readonly NODE_ENV: 'development' | 'production' | 'test'
		readonly ENVIRONMENT?: 'docker' | 'local'
		readonly SENTRY_AUTH_TOKEN?: string
		readonly SENTRY_ORG?: string
		readonly SENTRY_ADMIN_PROJECT?: string
		readonly NEXT_PUBLIC_ADMIN_SENTRY_DSN?: string
		readonly NEXT_PUBLIC_BASE_URL?: string
		readonly NEXT_PUBLIC_DEPLOY_URL?: string
		readonly NEXT_PUBLIC_FIREBASE_API_KEY?: string
		readonly NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?: string
		readonly NEXT_PUBLIC_FIREBASE_PROJECT_ID?: string
		readonly NEXT_PUBLIC_FIREBASE_APP_ID?: string
		readonly NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST?: string
	}
}
