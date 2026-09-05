import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { SkipThrottle } from '@nestjs/throttler'

import { HealthService } from './health.service'
import { HealthResponse } from './dto/health-response.dto'
import { Public } from 'common/decorators/public.decorator'
import { Message } from 'common/decorators/message.decorator'
import { ApiEndpoint } from 'common/decorators/swagger.decorator'

@ApiTags('Health')
@Controller({ path: 'health', version: VERSION_NEUTRAL })
export class HealthController {
	constructor(private readonly healthService: HealthService) {}

	@Get()
	@Public()
	@SkipThrottle()
	@Message('Health check successful.')
	@ApiEndpoint({
		auth: false,
		method: 'GET',
		type: HealthResponse,
		summary: 'Health check',
		endpoint: 'GET /api/v1/health',
		description: 'Returns the health status of the application and its dependencies.',
	})
	check() {
		return this.healthService.check()
	}
}
