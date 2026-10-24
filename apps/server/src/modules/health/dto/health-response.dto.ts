import { ApiProperty } from '@nestjs/swagger'

class HealthServices {
	@ApiProperty({ enum: ['up', 'down'], example: 'up' })
	database!: 'up' | 'down'

	@ApiProperty({ enum: ['up', 'down'], example: 'up' })
	redis!: 'up' | 'down'
}

export class HealthResponse {
	@ApiProperty({ enum: ['ok', 'degraded'], example: 'ok' })
	status?: 'ok' | 'degraded'

	@ApiProperty({ type: 'number', example: 86400, description: 'Application uptime in seconds' })
	uptime!: number

	@ApiProperty({ type: 'string', format: 'date-time', example: '2026-07-12T13:25:10.123Z' })
	timestamp!: string

	@ApiProperty({ type: 'string', example: '15ms' })
	responseTime!: string

	@ApiProperty({ type: HealthServices })
	services!: HealthServices
}
