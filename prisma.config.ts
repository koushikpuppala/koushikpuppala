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

if (!process.env.PRISMA_URI)
	throw new Error(
		'PRISMA_URI environment variable is not set. Please set it in your .env file or as a platform environment variable.',
	)

export default defineConfig({
	engine: 'classic',
	schema: 'src/prisma',
	datasource: { url: env('PRISMA_URI') },
	migrations: { path: 'src/prisma/migrations' },
	experimental: {
		extensions: true,
		externalTables: true,
		studio: process.env.NODE_ENV !== 'production',
	},
})
