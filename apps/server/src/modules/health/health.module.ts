import { Module } from '@nestjs/common'

import { DatabaseModule } from 'database'
import { RedisModule } from 'redis/redis.module'
import { HealthService } from './health.service'
import { HealthController } from './health.controller'

@Module({
	imports: [DatabaseModule, RedisModule],
	controllers: [HealthController],
	providers: [HealthService],
})
export class HealthModule {}
