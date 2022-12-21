export const config = {
	transport: {
		service: 'gmail',
		auth: {
			user: process.env.USER!,
			pass: process.env.PASS!,
		},
	},
	measurementId: 'G-8NPR1DDE8Y',
	tagManagerId: 'GTM-KM9WPPS',
	sentryDSN: process.env.NEXT_PUBLIC_SENTRY_DSN!,
}
