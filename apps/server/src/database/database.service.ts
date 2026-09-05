import type { OnModuleDestroy, OnModuleInit } from '@nestjs/common'

import { Pool } from 'pg'
import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@repo/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import { Configuration } from 'config/configuration'

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
	private readonly pool: Pool

	constructor(config: Configuration) {
		const pool = new Pool(config.database)

		const adapter = new PrismaPg(pool)

		super({ adapter, errorFormat: config.production ? 'minimal' : 'pretty' })

		this.pool = pool
	}

	async onModuleInit() {
		await this.$connect()
	}

	async onModuleDestroy() {
		await this.$disconnect()
		await this.pool.end()
	}
}
