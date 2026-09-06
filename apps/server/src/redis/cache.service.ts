import { Injectable } from '@nestjs/common'

import { RedisService } from './redis.service'

@Injectable()
export class CacheService {
	constructor(private readonly redis: RedisService) {}

	async remember<T>(key: string, ttl: number, callback: () => Promise<T>): Promise<T> {
		try {
			const cached = await this.redis.get(key)

			if (cached) return JSON.parse(cached) as T
		} catch {
			// Fallback to source of truth on cache read failure
		}

		const value = await callback()

		try {
			await this.redis.set(key, JSON.stringify(value), ttl)
		} catch {
			// Non-blocking cache write failure
		}

		return value
	}
}
