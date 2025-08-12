import { type AppOptions, credential } from 'firebase-admin'

export const firebaseAdminConfig: AppOptions = {
	credential: credential.cert({
		projectId: process.env.FIREBASE_PROJECT_ID,
		privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
		clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
	}),
	databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
}
