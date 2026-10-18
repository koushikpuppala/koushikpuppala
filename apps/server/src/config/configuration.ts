import type { PoolConfig } from 'pg'
import type { RedisOptions } from 'ioredis'
import type { ServiceAccount } from 'firebase-admin'
import type {
	AwsConfig,
	LoggerConfig,
	MailConfig,
	RecaptchaConfig,
	RevalidateConfig,
	SentryConfig,
} from 'types/server'

export class Configuration {
	readonly production = process.env.NODE_ENV === 'production'
	readonly port: number
	readonly appName: string
	readonly frontend: string
	readonly revalidate: RevalidateConfig
	readonly origin: string[]
	readonly trustProxy: boolean | number | string
	readonly environment: string
	readonly redis: RedisOptions
	readonly database: PoolConfig
	readonly firebase: ServiceAccount
	readonly logger: LoggerConfig
	readonly sentry: SentryConfig
	readonly recaptcha?: RecaptchaConfig
	readonly mail?: MailConfig
	readonly aws: AwsConfig

	constructor() {
		this.appName = this.required('APP_NAME')

		this.port = this.number('PORT')

		this.environment = this.required('NODE_ENV')

		this.frontend = this.required('NEXT_PUBLIC_DEPLOY_URL')

		this.revalidate = {
			url: (this.optional('REVALIDATE_URL') ?? this.frontend).replace(/\/+$/, ''),
			secret: this.optional('REVALIDATE_SECRET'),
		}

		this.origin = this.required('ORIGIN')
			.split(',')
			.map(o => o.trim())
			.filter(Boolean)

		// Express accepts a hop count, a boolean or a list of trusted addresses for 'trust proxy'.
		const trustProxy = this.required('TRUST_PROXY').trim()
		if (/^\d+$/.test(trustProxy)) this.trustProxy = Number.parseInt(trustProxy, 10)
		else if (trustProxy === 'true' || trustProxy === 'false')
			this.trustProxy = trustProxy === 'true'
		else this.trustProxy = trustProxy

		this.database = {
			connectionString: this.required('DATABASE_URL'),
			max: this.number('DATABASE_MAX_CONNECTIONS'),
			idleTimeoutMillis: this.number('DATABASE_IDLE_TIMEOUT'),
			connectionTimeoutMillis: this.number('DATABASE_CONNECTION_TIMEOUT'),
		}

		this.redis = {
			host: this.required('REDIS_HOST'),
			port: this.number('REDIS_PORT'),
			username: this.optional('REDIS_USERNAME'),
			password: this.production ? this.required('REDIS_PASSWORD') : this.optional('REDIS_PASSWORD'),
			db: this.number('REDIS_DB'),
			keepAlive: this.number('REDIS_KEEP_ALIVE'),
			lazyConnect: this.boolean('REDIS_LAZY_CONNECT'),
			connectTimeout: this.number('REDIS_CONNECT_TIMEOUT'),
			maxRetriesPerRequest: this.number('REDIS_MAX_RETRIES_PER_REQUEST'),
			...(this.flag('REDIS_TLS') && { tls: {} }),
		}

		this.firebase = {
			projectId: this.required('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
			clientEmail: this.required('FIREBASE_CLIENT_EMAIL'),
			// .env files store the key on one line with escaped newlines; PEM parsing needs real ones.
			privateKey: this.required('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
		}

		this.sentry = {
			enabled: Boolean(this.optional('SENTRY_DSN')),
			dsn: this.optional('SENTRY_DSN'),
		}

		// reCAPTCHA and email are required in production but optional locally, where they are skipped.
		const recaptchaSecret = this.production
			? this.required('RECAPTCHA_SECRET_KEY')
			: this.optional('RECAPTCHA_SECRET_KEY')

		if (recaptchaSecret) {
			const minScore = Number.parseFloat(this.required('RECAPTCHA_MIN_SCORE'))

			if (Number.isNaN(minScore) || minScore < 0 || minScore > 1)
				throw new Error('Environment variable RECAPTCHA_MIN_SCORE must be a number from 0 to 1')

			this.recaptcha = { secretKey: recaptchaSecret, minScore }
		}

		const mailFrom = this.production
			? this.required('SES_FROM_EMAIL')
			: this.optional('SES_FROM_EMAIL')

		if (mailFrom)
			this.mail = {
				from: mailFrom,
				contactTo: this.required('CONTACT_NOTIFY_EMAIL'),
				adminUrl: this.required('ADMIN_URL').replace(/\/+$/, ''),
			}

		this.logger = {
			dir: this.required('LOG_DIR'),
			level: this.environment === 'production' ? 'info' : 'debug',
		}

		const cdn = this.required('CDN_URL').trim()

		this.aws = {
			region: this.required('AWS_REGION'),
			s3Bucket: this.required('S3_BUCKET'),
			cdnUrl: (/^https?:\/\//i.test(cdn) ? cdn : `https://${cdn}`).replace(/\/+$/, ''),
			// Confirming an upload landed calls S3, so it runs only in production, where the instance role
			// grants access; local and test runs skip it.
			verifyUploads: this.production,
		}
	}

	private required(key: string): string {
		const value = process.env[key]

		if (!value) throw new Error(`Missing environment variable: ${key}`)

		return value
	}

	private optional(key: string): string | undefined {
		return process.env[key] || undefined
	}

	private number(key: string): number {
		const value = Number.parseInt(this.required(key), 10)

		if (Number.isNaN(value)) throw new Error(`Environment variable ${key} must be a number`)

		return value
	}

	private boolean(key: string): boolean {
		const value = this.required(key)

		if (value !== 'true' && value !== 'false')
			throw new Error(`Environment variable ${key} must be "true" or "false"`)

		return value === 'true'
	}

	// Opt-in flags: unset means off, unlike boolean() which requires the variable.
	private flag(key: string): boolean {
		return process.env[key] === 'true'
	}
}
