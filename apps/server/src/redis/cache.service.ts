import { Injectable } from '@nestjs/common'

import { RedisService } from './redis.service'

@Injectable()
export class CacheService {
	constructor(private readonly redis: RedisService) {}

	async remember<T>(key: string, ttl: number, callback: () => Promise<T>): Promise<T> {
		// Redis is only an accelerator: any read or write failure falls through to the callback,
		// so a Redis outage degrades to direct database queries instead of failing the request.
		try {
			const cached = await this.redis.get(key)

			if (cached) return JSON.parse(cached) as T
		} catch {}

		const value = await callback()

		// NX so a value written while the callback ran (such as a session revocation) wins over this possibly stale read.
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
