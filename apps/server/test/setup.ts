import './env'

import { generateKeyPairSync } from 'node:crypto'

process.env.FIREBASE_PRIVATE_KEY ??= generateKeyPairSync('rsa', { modulusLength: 2048 })
	.privateKey.export({ type: 'pkcs8', format: 'pem' })
	.toString()
