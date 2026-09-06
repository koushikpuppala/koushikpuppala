import type { Prisma } from '@repo/prisma'
import { DatabaseService } from 'database'
import { Injectable } from '@nestjs/common'
import { getDateRange } from 'common/utils/date-range.util'
import { QueryApiMetricDto } from './dto/query-api-metric.dto'
import { successResponse } from 'common/interfaces/api-response.interface'

@Injectable()
export class ApiMetricService {
	constructor(private readonly prisma: DatabaseService) {}

	async create(data: Prisma.ApiMetricCreateInput) {
		return this.prisma.apiMetric.create({ data })
	}

	async findAll(query: QueryApiMetricDto) {
		const { page = 1, limit = 20, search, status, method, from, to } = query
		const skip = (page - 1) * limit
		const where: Prisma.ApiMetricWhereInput = {}

		if (status) where.status = status
		if (method) where.method = { equals: method, mode: 'insensitive' }

		if (from || to) {
			const { from: startDate, to: endDate } = getDateRange({ from, to })

			where.createdAt = { ...(from && { gte: startDate }), ...(to && { lte: endDate }) }
		}

		const keyword = search?.trim()

		if (keyword)
			where.OR = [
				{ endpoint: { contains: keyword, mode: 'insensitive' } },
				{ ip: { contains: keyword, mode: 'insensitive' } },
				{ requestId: { contains: keyword, mode: 'insensitive' } },
			]

		const [metrics, total] = await this.prisma.$transaction([
			this.prisma.apiMetric.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
			this.prisma.apiMetric.count({ where }),
		])

		return successResponse(metrics, 'API metrics fetched successfully.', total)
	}

	async getStats() {
		const [total, agg, status2xx, status3xx, status4xx, status5xx, topEndpoints] =
			await this.prisma.$transaction([
				this.prisma.apiMetric.count(),
				this.prisma.apiMetric.aggregate({
					_avg: { duration: true },
					_min: { duration: true },
					_max: { duration: true },
				}),
				this.prisma.apiMetric.count({ where: { status: { gte: 200, lt: 300 } } }),
				this.prisma.apiMetric.count({ where: { status: { gte: 300, lt: 400 } } }),
				this.prisma.apiMetric.count({ where: { status: { gte: 400, lt: 500 } } }),
				this.prisma.apiMetric.count({ where: { status: { gte: 500 } } }),
				this.prisma.apiMetric.groupBy({
					take: 8,
					_avg: { duration: true },
					_count: { endpoint: true },
					by: ['endpoint', 'method'],
					orderBy: { _count: { endpoint: 'desc' } },
				}),
			])

		return successResponse(
			{
				totalRequests: total,
				minDurationMs: agg._min.duration || 0,
				maxDurationMs: agg._max.duration || 0,
				avgDurationMs: Math.round(agg._avg.duration || 0),
				statusBreakdown: { '2xx': status2xx, '3xx': status3xx, '4xx': status4xx, '5xx': status5xx },
				topEndpoints: topEndpoints.map(e => ({
					endpoint: e.endpoint,
					method: e.method,
					count: e._count.endpoint,
					avgDuration: Math.round(e._avg.duration || 0),
				})),
			},
			'API metrics stats calculated successfully.',
		)
	}
}
