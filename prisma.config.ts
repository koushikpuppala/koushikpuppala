import { defineConfig, env } from 'prisma/config'

import * as dotenv from 'dotenv'

// Only load dotenv when not running on Vercel
if (process.env.VERCEL !== '1')
	dotenv.config({ path: ['.env', `.env.${process.env.NODE_ENV}.local`] })

export default defineConfig({
	engine: 'classic',
	schema: 'src/prisma',
	experimental: { externalTables: true },
	datasource: { url: env('PRISMA_URI') },
	migrations: { path: 'src/prisma/migrations' },
})
