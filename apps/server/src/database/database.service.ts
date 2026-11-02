import type { OnModuleDestroy, OnModuleInit } from '@nestjs/common'

import { Pool } from 'pg'
import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@repo/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import { Configuration } from 'config/configuration'
import { omitUndefinedWrites } from './omit-undefined.extension'

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
	private readonly pool: Pool

	constructor(config: Configuration) {
		const pool = new Pool(config.database)

		const adapter = new PrismaPg(pool)

		super({ adapter, errorFormat: config.production ? 'minimal' : 'pretty' })

		// The adapter does not close the pg pool, so it is kept to be ended on shutdown.
		this.pool = pool

		// biome-ignore lint/correctness/noConstructorReturn: Prisma extensions return a new client
		return this.$extends(omitUndefinedWrites) as unknown as DatabaseService
	}

	async onModuleInit() {
		await this.$connect()
	}

	async onModuleDestroy() {
		await this.$disconnect()
		await this.pool.end()
	}
}
