import * as dotenv from 'dotenv'
import * as path from 'node:path'
import { defineConfig, env } from 'prisma/config'

// Only load dotenv when not running on Vercel
if (!process.env.VERCEL) dotenv.config({ path: path.resolve(process.cwd(), '.env') })
else
	console.log(
		'Running on Vercel, skipping dotenv configuration - using platform environment variables instead.',
	)

if (!process.env.DATABASE_URL)
	throw new Error(
		'One or more required Prisma environment variables are not set. Please set them in your .env file or as platform environment variables.',
	)

export default defineConfig({
	schema: 'prisma',
	datasource: { url: env('DATABASE_URL') },
	migrations: { path: 'prisma/migrations' },
	experimental: { extensions: true, externalTables: true },
})
