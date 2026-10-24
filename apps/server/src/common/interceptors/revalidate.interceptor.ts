import type { Observable } from 'rxjs'
import type { Request } from 'express'
import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'

import { tap } from 'rxjs'
import { Reflector } from '@nestjs/core'
import { Injectable } from '@nestjs/common'
import { Configuration } from 'config/configuration'
import { LoggerService } from 'common/logger/logger.service'
import { REVALIDATE_TAGS_KEY } from 'common/decorators/revalidate.decorator'

const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

@Injectable()
export class RevalidateInterceptor implements NestInterceptor {
	constructor(
		private readonly reflector: Reflector,
		private readonly config: Configuration,
		private readonly logger: LoggerService,
	) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
		const request = context.switchToHttp().getRequest<Request>()

		const tags = this.reflector.getAllAndOverride<string[]>(REVALIDATE_TAGS_KEY, [
			context.getHandler(),
			context.getClass(),
		])

		if (!tags?.length || !WRITE_METHODS.has(request.method)) return next.handle()

		// Runs only after the write succeeded, and does not wait: the public site refreshes in the background.
		return next.handle().pipe(tap(() => void this.revalidate(tags, request.requestId)))
	}

	private async revalidate(tags: string[], requestId: string): Promise<void> {
		const { url, secret } = this.config.revalidate

		// Revalidation is optional; without a shared secret the public site relies on its own cache lifetime.
		if (!secret) return

		try {
			const response = await fetch(`${url}/api/revalidate`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', 'x-revalidate-secret': secret },
				body: JSON.stringify({ tags }),
				signal: AbortSignal.timeout(5_000),
			})

			if (!response.ok) throw new Error(`HTTP ${response.status}`)

			this.logger.debug('Public site revalidated', RevalidateInterceptor.name, { tags, requestId })
		} catch (error) {
			// A failed revalidation leaves the site stale for a while but must not fail the admin's write.
			this.logger.warn('Public site revalidation failed', RevalidateInterceptor.name, {
				tags,
				requestId,
				error: error instanceof Error ? error.message : String(error),
			})
		}
	}
}
