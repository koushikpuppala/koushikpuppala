import type { App } from 'firebase-admin/app'
import type { DecodedIdToken, UserRecord } from 'firebase-admin/auth'
import type { OnModuleInit } from '@nestjs/common'

import { Injectable } from '@nestjs/common'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

import { Configuration } from 'config/configuration'
import { LoggerService } from 'common/logger/logger.service'

@Injectable()
export class FirebaseService implements OnModuleInit {
	private app!: App

	constructor(
		private readonly config: Configuration,
		private readonly logger: LoggerService,
	) {}

	onModuleInit() {
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
		meta?: { requestId: string; endpoint: string },
	): Promise<DecodedIdToken> {
		const start = Date.now()
		const reqId = meta?.requestId || 'unknown'
		const endpoint = meta?.endpoint || 'unknown'

		this.logger.info('Firebase verification started', FirebaseService.name, {
			requestId: reqId,
			endpoint,
		})

		try {
			const decoded = await this.auth.verifyIdToken(idToken, checkRevoked)

			this.logger.info('Firebase verification succeeded', FirebaseService.name, {
				requestId: reqId,
				endpoint,
				firebaseUid: decoded.uid,
				duration: Date.now() - start,
			})

			return decoded
		} catch (error) {
			this.logger.error(
				'Firebase verification failed',
				FirebaseService.name,
				error instanceof Error ? error : new Error(String(error)),
				{
					requestId: reqId,
					endpoint,
					duration: Date.now() - start,
				},
			)
			throw error
		}
	}

	getUser(uid: string): Promise<UserRecord> {
		return this.auth.getUser(uid)
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

	getUserByEmail(email: string): Promise<UserRecord> {
		return this.auth.getUserByEmail(email)
	}

	revokeRefreshTokens(uid: string): Promise<void> {
		return this.auth.revokeRefreshTokens(uid)
	}

	createCustomToken(uid: string): Promise<string> {
		return this.auth.createCustomToken(uid)
	}
}
