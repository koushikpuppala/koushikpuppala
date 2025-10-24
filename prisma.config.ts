import type { PrismaConfig } from 'prisma/config'

import * as dotenv from 'dotenv'

// Only load dotenv when not running on Vercel
if (process.env.VERCEL !== '1')
	dotenv.config({
		path: [`.env.${process.env.NODE_ENV || 'development'}.local`, '.env'],
	})

export default {
	schema: 'src/prisma',
	experimental: { adapter: true, studio: true, externalTables: true },
} satisfies PrismaConfig
