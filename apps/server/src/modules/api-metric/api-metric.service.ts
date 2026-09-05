import type { Prisma } from '@repo/prisma'

import { DatabaseService } from 'database'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ApiMetricService {
	constructor(private readonly prisma: DatabaseService) {}

	async create(data: Prisma.ApiMetricCreateInput) {
		return this.prisma.apiMetric.create({ data })
	}
}
