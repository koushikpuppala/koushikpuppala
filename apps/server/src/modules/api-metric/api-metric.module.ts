import { Module } from '@nestjs/common'

import { ApiMetricService } from './api-metric.service'
import { DatabaseModule } from 'database'

@Module({
	imports: [DatabaseModule],
	providers: [ApiMetricService],
	exports: [ApiMetricService],
})
export class ApiMetricModule {}
