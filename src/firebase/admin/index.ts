import * as admin from 'firebase-admin'
import { firebaseAdminConfig } from './config'

export const adminApp =
	admin.apps.find(app => app?.name === 'koushikpuppala-admin') ??
	admin.initializeApp(firebaseAdminConfig, 'koushikpuppala-admin')

export const adminAuth = admin.auth(adminApp)
