const assertValue = <T>(value: T | undefined, errorMessage: string): T => {
	if (value === undefined) {
		throw new Error(errorMessage)
	}

	return value
}

export const config = {
	useCdn: false,
	apiVersion: '2024-05-18',
	database: assertValue(process.env.NEXT_PUBLIC_DATABASE, 'Missing environment variable: NEXT_PUBLIC_DATABASE'),
	projectId: assertValue(process.env.NEXT_PUBLIC_SANITY_ID, 'Missing environment variable: NEXT_PUBLIC_SANITY_ID'),
	sentryDsn: assertValue(process.env.NEXT_PUBLIC_SENTRY_DSN, 'Missing environment variable: NEXT_PUBLIC_SENTRY_DSN'),
	deployUrl: assertValue(process.env.NEXT_PUBLIC_DEPLOY_URL, 'Missing environment variable: NEXT_PUBLIC_DEPLOY_URL'),
	firebase: {
		apiKey: assertValue(
			process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
			'Missing environment variable: NEXT_PUBLIC_FIREBASE_API_KEY',
		),
		authDomain: assertValue(
			process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
			'Missing environment variable: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
		),
		databaseURL: assertValue(
			process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
			'Missing environment variable: NEXT_PUBLIC_FIREBASE_DATABASE_URL',
		),
		projectId: assertValue(
			process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
			'Missing environment variable: NEXT_PUBLIC_FIREBASE_PROJECT_ID',
		),
		storageBucket: assertValue(
			process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
			'Missing environment variable: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
		),
		messagingSenderId: assertValue(
			process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
			'Missing environment variable: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
		),
		appId: assertValue(
			process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
			'Missing environment variable: NEXT_PUBLIC_FIREBASE_APP_ID',
		),
		measurementId: assertValue(
			process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
			'Missing environment variable: NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
		),
	},
}
