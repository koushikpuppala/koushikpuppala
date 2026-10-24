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
			// Startup must not fail without Redis: CacheService falls back to the database.
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

	async get(key: string): Promise<string | null> {
		return this.redis.get(key)
	}

	async set(key: string, value: string, ttl?: number): Promise<'OK' | null> {
		if (ttl) return this.redis.set(key, value, 'EX', ttl)

		return this.redis.set(key, value)
	}

	async setIfAbsent(key: string, value: string, ttl: number): Promise<'OK' | null> {
		return this.redis.set(key, value, 'EX', ttl, 'NX')
	}

	// SCAN walks the keyspace in batches instead of KEYS, which would block Redis on a large dataset.
	async delByPattern(pattern: string): Promise<number> {
		let cursor = '0'

		let totalDeleted = 0

		do {
			const [nextCursor, keys] = await this.redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100)

			cursor = nextCursor

			if (keys.length > 0) {
				const deleted = await this.redis.del(...keys)

				totalDeleted += deleted
			}
		} while (cursor !== '0')

		return totalDeleted
	}

	async ping(): Promise<'PONG'> {
		return this.redis.ping()
	}
}
