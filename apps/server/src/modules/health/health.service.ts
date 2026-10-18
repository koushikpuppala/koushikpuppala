import type { HealthStatusData } from 'types/api'

import { Injectable } from '@nestjs/common'
import { RedisService } from 'redis/redis.service'
import { DatabaseService } from 'database/database.service'
import { ApiResponse, successResponse } from 'common/interfaces/api-response.interface'

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
			// Answers normally even when a dependency is down, so the Docker healthcheck only fails
			// when the API itself is unreachable; dependency problems show up as 'degraded'.
			status: database === 'up' && redis === 'up' ? 'ok' : 'degraded',
		}

		return successResponse(data, 'Health check successful.')
	}
}
