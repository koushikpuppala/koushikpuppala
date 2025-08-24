declare namespace NodeJS {
	export interface ProcessEnv {
		readonly NODE_ENV: 'development' | 'production' | 'test'
		readonly ENVIRONMENT: 'docker' | 'local'
		readonly PRISMA_URI: string
		readonly MONGO_URI: string
		readonly MAIL_HOST: string
		readonly MAIL_USER: string
		readonly MAIL_PASS: string
		readonly ENABLE_SENTRY: string
		readonly SENTRY_AUTH_TOKEN: string
		readonly NEXT_PUBLIC_SENTRY_DSN: string
		readonly NEXT_PUBLIC_DEPLOY_URL: string
		readonly NEXT_PUBLIC_GOOGLE_ANALYTICS: string
		readonly NEXT_PUBLIC_MICROSOFT_CLARITY: string
		readonly NEXT_PUBLIC_RECAPTCHA_SITE_KEY: string
		readonly RECAPTCHA_SECRET_KEY: string
		readonly NEXT_PUBLIC_API_KEY: string
		readonly NEXT_PUBLIC_AUTH_DOMAIN: string
		readonly NEXT_PUBLIC_DATABASE_URL: string
		readonly NEXT_PUBLIC_PROJECT_ID: string
		readonly NEXT_PUBLIC_STORAGE_BUCKET: string
		readonly NEXT_PUBLIC_MESSAGING_SENDER_ID: string
		readonly NEXT_PUBLIC_APP_ID: string
		readonly FIREBASE_PRIVATE_KEY: string
		readonly FIREBASE_CLIENT_EMAIL: string
		readonly LOG_DIR: string
	}
}
