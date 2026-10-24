import { init } from '@sentry/nestjs'
import { nodeProfilingIntegration } from '@sentry/profiling-node'

init({
	tracesSampleRate: 1.0,
	dsn: process.env.SENTRY_DSN,
	profileSessionSampleRate: 1.0,
	integrations: [nodeProfilingIntegration()],
})
