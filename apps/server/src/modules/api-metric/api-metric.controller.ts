import { UserRole } from '@repo/prisma'
import { ApiTags } from '@nestjs/swagger'
import { ApiMetricService } from './api-metric.service'
import { Controller, Get, Query } from '@nestjs/common'
import { Roles } from 'common/decorators/roles.decorator'
import { QueryApiMetricDto } from './dto/query-api-metric.dto'
import { ApiEndpoint } from 'common/decorators/swagger.decorator'

@ApiTags('API Metrics')
@Controller('api-metrics')
@Roles(UserRole.EDITOR)
export class ApiMetricController {
	constructor(private readonly apiMetricService: ApiMetricService) {}

	@Get('stats')
	@ApiEndpoint({
		method: 'GET',
		endpoint: 'GET /api/v1/api-metrics/stats',
		summary: 'Get aggregated API telemetry metrics and status code breakdown',
	})
	getStats() {
		return this.apiMetricService.getStats()
	}

	@Get()
	@ApiEndpoint({
		method: 'GET',
		isPaginated: true,
		endpoint: 'GET /api/v1/api-metrics',
		summary: 'Get paginated API request telemetry logs',
	})
	findAll(@Query() query: QueryApiMetricDto) {
		return this.apiMetricService.findAll(query)
	}
}
