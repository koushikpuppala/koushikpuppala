import * as dotenv from 'dotenv'
import { defineConfig, env } from 'prisma/config'

// Only load dotenv when not running on Vercel
if (!process.env.VERCEL)
	dotenv.config({
		path: [
			'.env',
			'.env.local',
			process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development',
			process.env.NODE_ENV === 'production' ? '.env.production.local' : '.env.development.local',
		],
	})
else
	console.log(
		'Running on Vercel, skipping dotenv configuration - using platform environment variables instead.',
	)

if (!process.env.DATABASE_URL)
	throw new Error(
		'One or more required Prisma environment variables are not set. Please set them in your .env file or as platform environment variables.',
	)

export default defineConfig({
	schema: 'src/prisma',
	datasource: { url: env('DATABASE_URL') },
	migrations: { path: 'src/prisma/migrations' },
	experimental: { extensions: true, externalTables: true },
})
