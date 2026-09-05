import * as Sentry from '@sentry/nestjs'
import { nodeProfilingIntegration } from '@sentry/profiling-node'

// Ensure to call this before requiring any other modules!
Sentry.init({
	dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0',
	integrations: [
		// Add our Profiling integration
		nodeProfilingIntegration(),
	],
	// Set tracesSampleRate to 1.0 to capture 100%
	// of transactions for tracing.
	// We recommend adjusting this value in production
	// Learn more at
	// https://docs.sentry.io/platforms/javascript/guides/nestjs/configuration/options/#tracesSampleRate
	tracesSampleRate: 1.0,
	// Enable profiling for a percentage of sessions
	// Learn more at
	// https://docs.sentry.io/platforms/javascript/configuration/options/#profileSessionSampleRate
	profileSessionSampleRate: 1.0,
	// Enable logs to be sent to Sentry
	enableLogs: true,
})
