import type { RequestMeta } from 'types/server'
import type { App } from 'firebase-admin/app'
import type { OnModuleInit } from '@nestjs/common'
import type { DecodedIdToken, UserRecord } from 'firebase-admin/auth'

import { Injectable } from '@nestjs/common'
import { getAuth } from 'firebase-admin/auth'
import { Configuration } from 'config/configuration'
import { LoggerService, requestFields } from 'common/logger/logger.service'
import { cert, getApps, initializeApp } from 'firebase-admin/app'

@Injectable()
export class FirebaseService implements OnModuleInit {
	private app!: App

	constructor(
		private readonly config: Configuration,
		private readonly logger: LoggerService,
	) {}

	onModuleInit() {
		// Reuse the named app if it already exists, e.g. when tests create several Nest apps in one process.
		const existing = getApps().find(app => app.name === this.config.appName)

		this.app =
			existing ?? initializeApp({ credential: cert(this.config.firebase) }, this.config.appName)

		this.logger.info('Firebase Admin initialized', FirebaseService.name)
	}

	private get auth() {
		return getAuth(this.app)
	}

	async verifyIdToken(
		idToken: string,
		checkRevoked = true,
		meta?: RequestMeta,
	): Promise<DecodedIdToken> {
		return this.logger.timed(
			'Firebase verification',
			FirebaseService.name,
			requestFields(meta),
			() => this.auth.verifyIdToken(idToken, checkRevoked),
			{ result: decoded => ({ firebaseUid: decoded.uid }) },
		)
	}

	createUser(properties: Parameters<typeof this.auth.createUser>[0]): Promise<UserRecord> {
		return this.auth.createUser(properties)
	}

	updateUser(
		uid: string,
		properties: Parameters<typeof this.auth.updateUser>[1],
	): Promise<UserRecord> {
		return this.auth.updateUser(uid, properties)
	}

	deleteUser(uid: string): Promise<void> {
		return this.auth.deleteUser(uid)
	}
}
