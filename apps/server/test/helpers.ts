import type { INestApplication } from '@nestjs/common'

import Redis from 'ioredis'
import request from 'supertest'
import { vi } from 'vitest'
import { TEST_ENV } from './env'
import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module'
import { configureApp } from '../src/bootstrap'
import { DatabaseService } from 'database'
import { S3Service } from 'common/storage/s3.service'
import type { SendEmailOptions } from 'types/server'
import { SesService } from 'common/mail/ses.service'
import { AuthProvider, Prisma, UserRole, UserStatus } from '@repo/prisma'

const EMULATOR = `http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}`
const PROJECT = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

// Compares the parsed host rather than the URL text, so a host such as revalidate.test.example
// can never pass for the revalidation endpoint.
export const isRevalidateRequest = (input: unknown): boolean => {
	const url = input instanceof Request ? input.url : String(input)

	return URL.canParse(url) && new URL(url).host === new URL(TEST_ENV.REVALIDATE_URL).host
}

export const createFakeS3 = () => ({
	upload: vi.fn(),
	exists: vi.fn(async () => true),
	delete: vi.fn(async () => undefined),
	getSignedUrl: vi.fn(async (key: string) => `https://signed.test/${key}`),
	getPresignedUploadUrl: vi.fn(async (key: string) => `https://upload.test/${key}`),
})

export const createFakeSes = () => ({
	send: vi.fn(async (_options: SendEmailOptions) => undefined),
})

export type TestApp = {
	app: INestApplication
	prisma: DatabaseService
	s3: ReturnType<typeof createFakeS3>
	ses: ReturnType<typeof createFakeSes>
	http: () => ReturnType<typeof request>
}

export const bootApp = async (): Promise<TestApp> => {
	const s3 = createFakeS3()
	const ses = createFakeSes()

	const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
		.overrideProvider(S3Service)
		.useValue(s3)
		.overrideProvider(SesService)
		.useValue(ses)
		.compile()

	const app = moduleRef.createNestApplication({ rawBody: true, logger: false })
	configureApp(app)
	await app.init()

	return {
		app,
		s3,
		ses,
		prisma: app.get(DatabaseService),
		http: () => request(app.getHttpServer()),
	}
}

const lowerFirst = (value: string) => value.charAt(0).toLowerCase() + value.slice(1)

export const resetState = async (prisma: DatabaseService) => {
	const childrenFirst = ['ProjectGallery', 'Resume']
	const models = [
		...childrenFirst,
		...Object.values(Prisma.ModelName).filter(model => !childrenFirst.includes(model)),
	]

	for (const model of models) {
		const delegate = (prisma as unknown as Record<string, { deleteMany: () => Promise<unknown> }>)[
			lowerFirst(model)
		]
		await delegate?.deleteMany()
	}

	await fetch(`${EMULATOR}/emulator/v1/projects/${PROJECT}/accounts`, { method: 'DELETE' })

	const redis = new Redis({ host: TEST_ENV.REDIS_HOST, port: Number(process.env.REDIS_PORT) })
	await redis.flushdb()
	redis.disconnect()
}

let counter = 0

export const createUser = async (
	prisma: DatabaseService,
	role: UserRole,
	status: UserStatus = UserStatus.ACTIVE,
) => {
	counter += 1
	const email = `${role.toLowerCase()}${counter}@example.test`

	const response = await fetch(
		`${EMULATOR}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=test`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password: 'password123', returnSecureToken: true }),
		},
	)

	if (!response.ok) throw new Error(`Emulator sign up failed: ${await response.text()}`)

	const { idToken, localId } = (await response.json()) as { idToken: string; localId: string }

	const user = await prisma.user.create({
		data: {
			email,
			role,
			status,
			firebaseUid: localId,
			firstName: role,
			displayName: `${role} user`,
			provider: AuthProvider.PASSWORD,
		},
	})

	return { user, token: idToken, auth: { Authorization: `Bearer ${idToken}` } }
}
