import { Injectable } from '@nestjs/common'
import { DatabaseService } from 'database/database.service'
import { RedisService } from 'redis/redis.service'
import { ApiResponse, successResponse } from 'common/interfaces/api-response.interface'

export type HealthStatusData = {
	uptime: number
	services: { database: string; redis: string }
	timestamp: string
	responseTime: string
	status: 'ok' | 'degraded'
}

@Injectable()
export class HealthService {
	constructor(
		private readonly prisma: DatabaseService,
		private readonly redis: RedisService,
	) {}

	async check(): Promise<ApiResponse<HealthStatusData>> {
		const started = Date.now()
		let database = 'down'

		try {
			await this.prisma.$queryRaw`SELECT 1`
			database = 'up'
		} catch {}

		let redis = 'down'

		try {
			await this.redis.ping()
			redis = 'up'
		} catch {}

		const data: HealthStatusData = {
			uptime: process.uptime(),
			services: { database, redis },
			timestamp: new Date().toISOString(),
			responseTime: `${Date.now() - started}ms`,
			status: database === 'up' && redis === 'up' ? 'ok' : 'degraded',
		}

		return successResponse(data, 'Health check successful.')
	}
}
