const assertValue = <T>(value: T | undefined, errorMessage: string): T => {
	if (value === undefined) throw new Error(errorMessage)

	return value
}

export const config = {
	apiVersion: new Date().toISOString().split('T')[0],
	useCdn: false,
	dataset: assertValue(process.env.NEXT_PUBLIC_DATASET, 'Missing environment variable: NEXT_PUBLIC_DATASET'),
	projectId: assertValue(process.env.NEXT_PUBLIC_SANITY_ID, 'Missing environment variable: NEXT_PUBLIC_SANITY_ID'),
	sentryDsn: assertValue(process.env.NEXT_PUBLIC_SENTRY_DSN, 'Missing environment variable: NEXT_PUBLIC_SENTRY_DSN'),
	deployUrl: assertValue(process.env.NEXT_PUBLIC_DEPLOY_URL, 'Missing environment variable: NEXT_PUBLIC_DEPLOY_URL'),
	googleAnalytics: assertValue(
		process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS,
		'Missing environment variable: NEXT_PUBLIC_GOOGLE_ANALYTICS',
	),
	microsoftClarity: assertValue(
		process.env.NEXT_PUBLIC_MICROSOFT_CLARITY,
		'Missing environment variable: NEXT_PUBLIC_MICROSOFT_CLARITY',
	),
	reCaptchaSiteKey: assertValue(
		process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
		'Missing environment variable: NEXT_PUBLIC_RECAPTCHA_SITE_KEY',
	),
}
