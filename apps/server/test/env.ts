import { tmpdir } from 'node:os'
import { join } from 'node:path'

export const TEST_ENV = {
	NODE_ENV: 'test',
	APP_NAME: 'koushikpuppala-test',
	PORT: '0',
	NEXT_PUBLIC_DEPLOY_URL: 'http://frontend.test',
	ORIGIN: 'http://frontend.test',
	DATABASE_URL: 'postgresql://test:test@127.0.0.1:55432/portfolio_test',
	DATABASE_MAX_CONNECTIONS: '5',
	DATABASE_IDLE_TIMEOUT: '30000',
	DATABASE_CONNECTION_TIMEOUT: '10000',
	REDIS_HOST: '127.0.0.1',
	REDIS_PORT: '56379',
	REDIS_DB: '0',
	REDIS_LAZY_CONNECT: 'true',
	REDIS_CONNECT_TIMEOUT: '10000',
	REDIS_KEEP_ALIVE: '30000',
	REDIS_MAX_RETRIES_PER_REQUEST: '3',
	FIREBASE_AUTH_EMULATOR_HOST: '127.0.0.1:9099',
	NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'demo-koushikpuppala',
	FIREBASE_CLIENT_EMAIL: 'test@demo-koushikpuppala.iam.gserviceaccount.com',
	TRUST_PROXY: 'loopback',
	REVALIDATE_URL: 'http://revalidate.test',
	REVALIDATE_SECRET: 'test-revalidate-secret',
	RECAPTCHA_SECRET_KEY: '',
	SES_FROM_EMAIL: 'form@koushikpuppala.test',
	CONTACT_NOTIFY_EMAIL: 'owner@koushikpuppala.test',
	ADMIN_URL: 'http://admin.test',
	LOG_DIR: join(tmpdir(), 'koushikpuppala-server-test-logs'),
	AWS_REGION: 'us-east-1',
	S3_BUCKET: 'test-bucket',
	CDN_URL: 'https://cdn.test',
}

for (const [key, value] of Object.entries(TEST_ENV)) process.env[key] ??= value
