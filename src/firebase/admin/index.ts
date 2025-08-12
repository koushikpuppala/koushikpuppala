import { logger } from 'lib/logger'
import * as admin from 'firebase-admin'
import { firebaseAdminConfig } from './config'

try {
	admin.initializeApp(firebaseAdminConfig, 'koushikpuppala-admin')

	logger.info('Firebase Admin Initialized', 'Firebase/AdminInitialize')
} catch (error) {
	logger.error('Firebase Admin Initialization Error', 'Firebase/AdminInitialize', error as Error)
}

export const adminApp = admin.app('koushikpuppala-admin')

export const adminAuth = admin.auth(adminApp)
