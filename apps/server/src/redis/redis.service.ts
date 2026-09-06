import type { OnModuleDestroy, OnModuleInit } from '@nestjs/common'

import Redis from 'ioredis'
import { Injectable } from '@nestjs/common'
import { Configuration } from 'config/configuration'
import { LoggerService } from 'common/logger/logger.service'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
	private readonly redis: Redis

	constructor(
		private readonly logger: LoggerService,
		private readonly config: Configuration,
	) {
		this.redis = new Redis(this.config.redis)

		this.redis.on('connect', () => {
			this.logger.info('Redis connected', RedisService.name)
		})

		this.redis.on('reconnecting', () => {
			this.logger.warn('Redis reconnecting', RedisService.name)
		})

		this.redis.on('error', error => {
			this.logger.error('Redis error', RedisService.name, error)
		})
	}

	async onModuleInit() {
		try {
			if (this.redis.status === 'wait') await this.redis.connect()

			await this.redis.ping()

			this.logger.info('Redis connection established', RedisService.name)
		} catch (err: unknown) {
			this.logger.warn(
				'Redis unavailable during startup; requests will degrade gracefully to direct database access',
				RedisService.name,
				{ error: err instanceof Error ? err.message : String(err) },
			)
		}
	}

	async onModuleDestroy() {
		await this.redis.quit()

		this.logger.info('Redis connection closed', RedisService.name)
	}

	async get(key: string) {
		return this.redis.get(key)
	}

	async set(key: string, value: string, ttl?: number) {
		if (ttl) return this.redis.set(key, value, 'EX', ttl)

		return this.redis.set(key, value)
	}

	async del(key: string) {
		return this.redis.del(key)
	}

	async ping() {
		return this.redis.ping()
	}
}
