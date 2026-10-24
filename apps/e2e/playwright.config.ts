import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { generateKeyPairSync } from 'node:crypto'
import { defineConfig, devices } from '@playwright/test'
import {
	ADMIN_URL,
	API_URL,
	AUTH_EMULATOR_HOST,
	CLIENT_URL,
	DATABASE_URL,
	FIREBASE_PROJECT_ID,
	REDIS_PORT,
	REVALIDATE_SECRET,
} from './env'

const CI = Boolean(process.env.CI)

const ROOT = join(import.meta.dirname, '../..')

const privateKey = generateKeyPairSync('rsa', { modulusLength: 2048 })
	.privateKey.export({ type: 'pkcs8', format: 'pem' })
	.toString()

const port = (url: string) => new URL(url).port

export default defineConfig({
	testDir: './tests',
	workers: 1,
	fullyParallel: false,
	forbidOnly: CI,
	retries: CI ? 2 : 0,
	timeout: 30_000,
	expect: { timeout: 10_000 },
	reporter: CI
		? [['github'], ['html', { open: 'never' }]]
		: [['list'], ['html', { open: 'never' }]],
	use: { trace: 'on-first-retry', screenshot: 'only-on-failure' },

	projects: [
		{ name: 'setup', testMatch: /seed\.setup\.ts/ },
		{
			name: 'client-desktop',
			testDir: './tests/client',
			dependencies: ['setup'],
			use: { ...devices['Desktop Chrome'], baseURL: CLIENT_URL },
		},
		{
			name: 'client-mobile',
			testDir: './tests/client',
			dependencies: ['setup'],
			use: { ...devices['Pixel 7'], baseURL: CLIENT_URL },
		},
		{
			name: 'admin',
			testDir: './tests/admin',
			dependencies: ['setup'],
			use: { ...devices['Desktop Chrome'], baseURL: ADMIN_URL },
		},
	],

	webServer: [
		{
			name: 'api',
			cwd: ROOT,
			command:
				'pnpm --filter @repo/prisma exec prisma migrate deploy && pnpm --filter server build && node apps/server/dist/main.js',
			url: `${API_URL}/api/health`,
			stdout: 'pipe',
			reuseExistingServer: !CI,
			timeout: 180_000,
			env: {
				NODE_ENV: 'test',
				APP_NAME: 'koushikpuppala-e2e',
				PORT: port(API_URL),
				NEXT_PUBLIC_BASE_URL: API_URL,
				DATABASE_URL,
				DATABASE_MAX_CONNECTIONS: '5',
				DATABASE_IDLE_TIMEOUT: '30000',
				DATABASE_CONNECTION_TIMEOUT: '10000',
				REDIS_HOST: '127.0.0.1',
				REDIS_PORT,
				REDIS_DB: '0',
				REDIS_LAZY_CONNECT: 'true',
				REDIS_CONNECT_TIMEOUT: '10000',
				REDIS_KEEP_ALIVE: '30000',
				REDIS_MAX_RETRIES_PER_REQUEST: '3',
				FIREBASE_AUTH_EMULATOR_HOST: AUTH_EMULATOR_HOST,
				NEXT_PUBLIC_FIREBASE_PROJECT_ID: FIREBASE_PROJECT_ID,
				FIREBASE_CLIENT_EMAIL: `e2e@${FIREBASE_PROJECT_ID}.iam.gserviceaccount.com`,
				FIREBASE_PRIVATE_KEY: privateKey,
				ORIGIN: `${CLIENT_URL},${ADMIN_URL}`,
				NEXT_PUBLIC_DEPLOY_URL: CLIENT_URL,
				REVALIDATE_URL: CLIENT_URL,
				REVALIDATE_SECRET,
				TRUST_PROXY: 'loopback',
				SENTRY_DSN: '',
				RECAPTCHA_SECRET_KEY: '',
				SES_FROM_EMAIL: '',
				LOG_DIR: join(tmpdir(), 'koushikpuppala-e2e-logs'),
				AWS_REGION: 'us-east-1',
				S3_BUCKET: 'e2e-bucket',
				CDN_URL: 'https://cdn.e2e.test',
			},
		},
		{
			name: 'client',
			cwd: ROOT,
			command: `node apps/e2e/scripts/wait-for.mjs ${API_URL}/api/health && pnpm --filter client build && pnpm --filter client exec next start -H 127.0.0.1 -p ${port(CLIENT_URL)}`,
			url: CLIENT_URL,
			reuseExistingServer: !CI,
			timeout: 420_000,
			env: {
				NEXT_PUBLIC_BASE_URL: API_URL,
				NEXT_PUBLIC_DEPLOY_URL: CLIENT_URL,
				REVALIDATE_SECRET,
				ENVIRONMENT: 'local',
				NEXT_PUBLIC_CLIENT_SENTRY_DSN: '',
				NEXT_PUBLIC_RECAPTCHA_SITE_KEY: '',
				CDN_URL: 'https://cdn.e2e.test',
			},
		},
		{
			name: 'admin',
			cwd: ROOT,
			command: `node apps/e2e/scripts/wait-for.mjs ${API_URL}/api/health && pnpm --filter admin build && pnpm --filter admin exec next start -H 127.0.0.1 -p ${port(ADMIN_URL)}`,
			url: `${ADMIN_URL}/login`,
			reuseExistingServer: !CI,
			timeout: 420_000,
			env: {
				ENVIRONMENT: 'local',
				NEXT_PUBLIC_BASE_URL: API_URL,
				NEXT_PUBLIC_DEPLOY_URL: CLIENT_URL,
				NEXT_PUBLIC_FIREBASE_API_KEY: 'e2e-api-key',
				NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: '127.0.0.1',
				NEXT_PUBLIC_FIREBASE_PROJECT_ID: FIREBASE_PROJECT_ID,
				NEXT_PUBLIC_FIREBASE_APP_ID: 'e2e-app',
				NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST: AUTH_EMULATOR_HOST,
				NEXT_PUBLIC_ADMIN_SENTRY_DSN: '',
				AWS_REGION: 'us-east-1',
				S3_BUCKET: 'e2e-bucket',
				CDN_URL: 'https://cdn.e2e.test',
			},
		},
	],
})
