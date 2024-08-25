declare namespace NodeJS {
	export interface ProcessEnv {
		readonly MONGO_URI: string
		readonly MONGO_API: string
		readonly DATABASE: string
		readonly APP_NAME: string
		readonly HOST: string
		readonly USER: string
		readonly PASS: string
		readonly SENTRY_AUTH_TOKEN: string
		readonly NEXT_PUBLIC_SENTRY_DSN: string
		readonly NEXT_PUBLIC_DEPLOY_URL: string
		readonly NEXT_PUBLIC_GOOGLE_ANALYTICS: string
		readonly NEXT_PUBLIC_MICROSOFT_CLARITY: string
		readonly NEXT_PUBLIC_RECAPTCHA_SITE_KEY: string
		readonly RECAPTCHA_SECRET_KEY: string
		readonly NEXT_PUBLIC_SANITY_ID: string
		readonly NEXT_PUBLIC_DATASET: string
	}
}
