import type { Observable } from 'rxjs'
import type { Request, Response } from 'express'
import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'

import { finalize } from 'rxjs'
import { Prisma } from '@repo/prisma'
import { Injectable } from '@nestjs/common'
import { LoggerService } from 'common/logger/logger.service'
import { ApiMetricService } from 'modules/api-metric/api-metric.service'

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
	constructor(
		private readonly logger: LoggerService,
		private readonly apiMetricService: ApiMetricService,
	) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
		const request = context.switchToHttp().getRequest<Request>()
		const response = context.switchToHttp().getResponse<Response>()

		if (request.path === '/api/health') return next.handle()

		return next.handle().pipe(
			finalize(() => {
				const duration = Date.now() - request.startTime

				const data: Prisma.ApiMetricCreateInput = {
					duration,
					method: request.method,
					status: response.statusCode,
					requestId: request.requestId,
					endpoint: `${request.method} ${request.originalUrl}`,
					userAgent: request.context?.userAgent || request.headers['user-agent'] || 'unknown',
					ip:
						request.context?.ip ||
						request?.ip ||
						request.headers['x-forwarded-for']?.toString() ||
						'unknown',
				}

				void this.apiMetricService.create(data).catch(error => {
					this.logger.error('Failed to create API metric', LoggerInterceptor.name, error)
				})

				this.logger.info('Request completed', LoggerInterceptor.name, {
					...data,
					userId: request.user?.id,
				})
			}),
		)
	}
}
