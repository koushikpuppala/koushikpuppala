import { Global, Module } from '@nestjs/common'

import { RedisService } from './redis.service'
import { CacheService } from './cache.service'

@Global()
@Module({ providers: [RedisService, CacheService] })
export class RedisModule {}
