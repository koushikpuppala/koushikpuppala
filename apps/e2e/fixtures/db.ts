import { PrismaPg } from '@prisma/adapter-pg'
import { AuthProvider, Prisma, PrismaClient, UserRole } from '@repo/prisma'
import { API_URL, AUTH_EMULATOR_HOST, DATABASE_URL, FIREBASE_PROJECT_ID } from '../env'

export const prisma: PrismaClient = new PrismaClient({
	adapter: new PrismaPg({ connectionString: DATABASE_URL }),
})

const EMULATOR = `http://${AUTH_EMULATOR_HOST}`

export const resetAll = async () => {
	const childrenFirst = ['ProjectGallery', 'Resume']
	const models = [
		...childrenFirst,
		...Object.values(Prisma.ModelName).filter(model => !childrenFirst.includes(model)),
	]

	for (const model of models) {
		const name = model.charAt(0).toLowerCase() + model.slice(1)
		await (prisma as unknown as Record<string, { deleteMany: () => Promise<unknown> }>)[
			name
		]?.deleteMany()
	}

	await fetch(`${EMULATOR}/emulator/v1/projects/${FIREBASE_PROJECT_ID}/accounts`, {
		method: 'DELETE',
	})
}

export const createAccount = async (account: {
	email: string
	password: string
	role: UserRole
}) => {
	const response = await fetch(
		`${EMULATOR}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=e2e`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				email: account.email,
				password: account.password,
				returnSecureToken: true,
			}),
		},
	)

	if (!response.ok) throw new Error(`Emulator sign up failed: ${await response.text()}`)

	const { idToken, localId } = (await response.json()) as { idToken: string; localId: string }

	await prisma.user.create({
		data: {
			email: account.email,
			role: account.role,
			firebaseUid: localId,
			firstName: account.role,
			displayName: `E2E ${account.role.toLowerCase()}`,
			provider: AuthProvider.PASSWORD,
		},
	})

	return idToken
}

export const apiAs = (token: string) => {
	const call = async <T>(method: string, path: string, body?: unknown): Promise<T> => {
		const response = await fetch(`${API_URL}${path}`, {
			method,
			headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
			body: body === undefined ? undefined : JSON.stringify(body),
		})

		const json = (await response.json().catch(() => ({}))) as { result?: T; message?: string }

		if (!response.ok)
			throw new Error(`${method} ${path} failed (${response.status}): ${json.message}`)

		return json.result as T
	}

	return {
		post: <T>(path: string, body: unknown) => call<T>('POST', path, body),
		patch: <T>(path: string, body: unknown) => call<T>('PATCH', path, body),
	}
}

export { UserRole }
