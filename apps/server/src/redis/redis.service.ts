import type { OnModuleDestroy, OnModuleInit } from '@nestjs/common'

import Redis from 'ioredis'
import { randomUUID } from 'node:crypto'
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

	getClient(): Redis {
		return this.redis
	}

	async get(key: string): Promise<string | null> {
		return this.redis.get(key)
	}

	async set(key: string, value: string, ttl?: number): Promise<'OK' | null> {
		if (ttl) return this.redis.set(key, value, 'EX', ttl)

		return this.redis.set(key, value)
	}

	async del(...keys: string[]): Promise<number> {
		if (keys.length === 0) return 0

		return this.redis.del(...keys)
	}

	async expire(key: string, seconds: number): Promise<number> {
		return this.redis.expire(key, seconds)
	}

	async ttl(key: string): Promise<number> {
		return this.redis.ttl(key)
	}

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

	async acquireLock(resource: string, ttlMs = 5000): Promise<string | null> {
		const token = randomUUID()

		const lockKey = `lock:${resource}`

		try {
			const result = await this.redis.set(lockKey, token, 'PX', ttlMs, 'NX')

			return result === 'OK' ? token : null
		} catch {
			return null
		}
	}

	async releaseLock(resource: string, token: string): Promise<boolean> {
		const lockKey = `lock:${resource}`

		const luaScript = `
			if redis.call('get', KEYS[1]) == ARGV[1] then
				return redis.call('del', KEYS[1])
			else
				return 0
			end
		`

		try {
			const result = await this.redis.eval(luaScript, 1, lockKey, token)

			return result === 1
		} catch {
			return false
		}
	}

	async incrWithExpire(key: string, ttlSeconds: number): Promise<number> {
		const results = await this.redis.pipeline().incr(key).expire(key, ttlSeconds).exec()

		if (!results || results.length === 0) return 0

		const first = results[0]

		if (!first) return 0

		const [err, val] = first

		if (err) throw err

		return Number(val)
	}

	async ping(): Promise<'PONG'> {
		return this.redis.ping()
	}
}
