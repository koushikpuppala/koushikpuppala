import { config } from 'dotenv'
import { resolve } from 'node:path'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './generated/client'
import { createSeed } from './seed/steps'

config({ path: resolve(process.cwd(), '../../.env'), quiet: true })
config({ path: resolve(process.cwd(), '.env'), quiet: true })

const requireEnv = (name: string) => {
	const value = process.env[name]

	if (!value) throw new Error(`Missing environment variable: ${name}`)

	return value
}

const connectionString = requireEnv('DATABASE_URL')
const clientUrl = requireEnv('NEXT_PUBLIC_DEPLOY_URL').replace(/\/+$/, '')
const bucket = requireEnv('S3_BUCKET')

const isLoopback = (host: string) => ['localhost', '127.0.0.1', '[::1]', '::1'].includes(host)

if (isLoopback(new URL(clientUrl).hostname) && !isLoopback(new URL(connectionString).hostname))
	throw new Error(
		'Refusing to seed a remote database with a localhost NEXT_PUBLIC_DEPLOY_URL: set it to the site URL.',
	)

const pool = new Pool({ connectionString })
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })

const main = async () => {
	console.log('🌱 Seeding portfolio content...')

	await prisma.$transaction(createSeed(bucket, clientUrl), { timeout: 120_000, maxWait: 30_000 })

	console.log('✅ Seed completed successfully!')
}

main()
	.catch(e => {
		console.error('❌ Error during seed:', e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
		await pool.end()
	})
