import type { PoolConfig } from 'pg'
import type { RedisOptions } from 'ioredis'
import type { ServiceAccount } from 'firebase-admin'

export class Configuration {
	readonly production = process.env.NODE_ENV === 'production'
	readonly port: number
	readonly appName: string
	readonly frontend: string
	readonly origin: string[]
	readonly environment: string
	readonly redis: RedisOptions
	readonly database: PoolConfig
	readonly firebase: ServiceAccount
	readonly logger: { dir: string; level: string }
	readonly sentry: { enabled: boolean; dsn?: string }
	readonly app: { backendUrl: string; bypassAuth: boolean }
	readonly aws: { region: string; s3Bucket: string; cdnUrl: string }

	constructor() {
		this.appName = this.get('APP_NAME', 'koushikpuppala')

		this.port = this.number('PORT', this.number('SERVER_PORT', 8080))

		this.environment = this.get('NODE_ENV', 'development')

		const defaultFrontend = this.production
			? 'https://koushikpuppala.com'
			: 'http://localhost:3000'
		this.frontend = this.get('FRONTEND_URL', defaultFrontend)

		const defaultOrigins = this.production
			? 'https://koushikpuppala.com,https://admin.koushikpuppala.com'
			: 'http://localhost:3000,http://localhost:3001'
		this.origin = this.get('ORIGIN', defaultOrigins)
			.split(',')
			.map(o => o.trim())
			.filter(Boolean)

		this.database = {
			connectionString: this.required('DATABASE_URL'),
			max: this.number('DATABASE_MAX_CONNECTIONS', 10),
			idleTimeoutMillis: this.number('DATABASE_IDLE_TIMEOUT', 30_000),
			connectionTimeoutMillis: this.number('DATABASE_CONNECTION_TIMEOUT', 10_000),
		}

		this.redis = {
			host: this.get('REDIS_HOST', 'server.koushikpuppala.com'),
			port: this.number('REDIS_PORT', 6379),
			username: this.optional('REDIS_USERNAME'),
			password: this.optional('REDIS_PASSWORD'),
			db: this.number('REDIS_DB', 0),
			keepAlive: this.number('REDIS_KEEP_ALIVE', 30_000),
			lazyConnect: this.boolean('REDIS_LAZY_CONNECT', true),
			connectTimeout: this.number('REDIS_CONNECT_TIMEOUT', 10_000),
			maxRetriesPerRequest: this.number('REDIS_MAX_RETRIES_PER_REQUEST', 3),
		}

		this.firebase = {
			projectId: this.required('FIREBASE_PROJECT_ID'),
			clientEmail: this.required('FIREBASE_CLIENT_EMAIL'),
			privateKey: this.required('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
		}

		this.sentry = {
			enabled: this.boolean('ENABLE_SENTRY', false),
			dsn: this.optional('SENTRY_DSN'),
		}

		this.logger = {
			dir: this.get('LOG_DIR', 'logs'),
			level: this.environment === 'production' ? 'info' : 'debug',
		}

		this.aws = {
			region: this.get('AWS_REGION', 'ap-south-2'),
			s3Bucket: this.get('S3_BUCKET', 'koushikpuppala'),
			cdnUrl: this.get('CDN_URL', 'https://assets.koushikpuppala.com'),
		}

		const defaultBackend = this.production
			? 'https://api.koushikpuppala.com'
			: 'http://localhost:5000'
		this.app = {
			backendUrl: this.get('BACKEND_URL', defaultBackend),
			bypassAuth: this.production ? false : this.boolean('BYPASS_AUTH', false),
		}
	}

	private required(key: string): string {
		const value = process.env[key]

		if (!value) throw new Error(`Missing environment variable: ${key}`)

		return value
	}

	private get(key: string, defaultValue: string): string {
		return process.env[key] ?? defaultValue
	}

	private optional(key: string): string | undefined {
		return process.env[key]
	}

	private number(key: string, defaultValue: number): number {
		const value = process.env[key]

		return value ? Number.parseInt(value, 10) : defaultValue
	}

	private boolean(key: string, defaultValue: boolean): boolean {
		const value = process.env[key]

		if (!value) return defaultValue

		return value === 'true'
	}
}
