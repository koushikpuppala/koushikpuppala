import { Module } from '@nestjs/common'
import { DatabaseModule } from 'database'
import { ApiMetricService } from './api-metric.service'
import { ApiMetricController } from './api-metric.controller'

@Module({
	imports: [DatabaseModule],
	controllers: [ApiMetricController],
	providers: [ApiMetricService],
	exports: [ApiMetricService],
})
export class ApiMetricModule {}
