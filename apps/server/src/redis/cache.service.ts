import { Injectable } from '@nestjs/common'

import { RedisService } from './redis.service'

@Injectable()
export class CacheService {
	constructor(private readonly redis: RedisService) {}

	async remember<T>(key: string, ttl: number, callback: () => Promise<T>): Promise<T> {
		// Redis only speeds things up, so any Redis failure falls through to the callback.
		try {
			const cached = await this.redis.get(key)

			if (cached) return JSON.parse(cached) as T
		} catch {}

		const value = await callback()

		// NX keeps a value written concurrently from being overwritten.
		try {
			await this.redis.setIfAbsent(key, JSON.stringify(value), ttl)
		} catch {}

		return value
	}

	async forgetByPattern(pattern: string): Promise<number> {
		try {
			return await this.redis.delByPattern(pattern)
		} catch {
			return 0
		}
	}
}
