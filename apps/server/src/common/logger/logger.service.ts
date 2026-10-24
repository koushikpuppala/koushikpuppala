import type { LogFields, RequestMeta, TimedOptions } from 'types/server'
import 'winston-daily-rotate-file'

import { type SeverityLevel, withScope, captureException, captureMessage } from '@sentry/nestjs'
import { Injectable } from '@nestjs/common'
import { existsSync, mkdirSync } from 'node:fs'
import { Configuration } from 'config/configuration'
import { createLogger, format, transports } from 'winston'

const SENSITIVE_KEY = /authorization|password|passwd|secret|token|cookie|private.?key|credential/i

// Masks values under sensitive keys before anything reaches the log files or Sentry.
// Depth and cycle limits keep large or circular objects from blowing up a log call.
export const redact = (value: unknown, depth = 0, seen = new WeakSet<object>()): unknown => {
	if (value === null || typeof value !== 'object') return value

	if (depth > 6 || seen.has(value)) return '[Truncated]'

	seen.add(value)

	if (Array.isArray(value)) return value.map(item => redact(item, depth + 1, seen))

	if (value instanceof Date || Buffer.isBuffer(value)) return value

	const result: Record<string, unknown> = {}

	for (const [key, entry] of Object.entries(value))
		result[key] = SENSITIVE_KEY.test(key) ? '[Redacted]' : redact(entry, depth + 1, seen)

	return result
}

const toError = (error: unknown): Error =>
	error instanceof Error ? error : new Error(String(error))

export const requestFields = (meta?: RequestMeta): LogFields => ({
	requestId: meta?.requestId || 'unknown',
	endpoint: meta?.endpoint || 'unknown',
})

@Injectable()
export class LoggerService {
	private readonly logger

	constructor(private readonly config: Configuration) {
		if (!existsSync(this.config.logger.dir)) mkdirSync(this.config.logger.dir, { recursive: true })

		this.logger = createLogger({
			level: this.config.logger.level,

			format: format.combine(
				format.errors({ stack: true }),
				format.timestamp(),
				format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'stack'] }),
				format.json(),
			),

			transports: [
				new transports.Console(),

				new transports.DailyRotateFile({
					maxSize: '20m',
					maxFiles: '30d',
					datePattern: 'YYYY-MM-DD',
					dirname: this.config.logger.dir,
					filename: 'application-%DATE%.log',
				}),

				new transports.DailyRotateFile({
					level: 'error',
					maxSize: '20m',
					maxFiles: '30d',
					datePattern: 'YYYY-MM-DD',
					filename: 'error-%DATE%.log',
					dirname: this.config.logger.dir,
				}),

				// Kept three times longer than the application log for audit purposes.
				new transports.DailyRotateFile({
					level: 'info',
					maxSize: '20m',
					maxFiles: '90d',
					datePattern: 'YYYY-MM-DD',
					filename: 'audit-%DATE%.log',
					dirname: this.config.logger.dir,
				}),
			],
		})
	}

	private safe(meta?: Record<string, unknown>): Record<string, unknown> {
		return meta ? (redact(meta) as Record<string, unknown>) : {}
	}

	private captureSentry(
		level: SeverityLevel,
		message: string,
		context: string,
		meta?: Record<string, unknown>,
		error?: Error,
	) {
		if (!this.config.sentry.enabled) return

		withScope(scope => {
			scope.setLevel(level)
			scope.setTag('context', context)

			if (meta) scope.setExtras(this.safe(meta))

			if (error) captureException(error)
			else captureMessage(message)
		})
	}

	info(message: string, context: string, meta?: Record<string, unknown>) {
		this.logger.info({ message, context, ...this.safe(meta) })
	}

	debug(message: string, context: string, meta?: Record<string, unknown>) {
		this.logger.debug({ message, context, ...this.safe(meta) })
	}

	warn(message: string, context: string, meta?: Record<string, unknown>) {
		this.logger.warn({ message, context, ...this.safe(meta) })
	}

	error(message: string, context: string, error?: Error, meta?: Record<string, unknown>) {
		this.logger.error({ message, context, error: error?.stack, ...this.safe(meta) })

		this.captureSentry('error', message, context, meta, error)
	}

	// Logs start, completion and duration of an async operation. Errors that options.expected
	// recognises are rethrown without an error log, e.g. a token that is simply invalid.
	async timed<T>(
		operation: string,
		context: string,
		fields: LogFields,
		run: () => Promise<T>,
		options: TimedOptions<T> = {},
	): Promise<T> {
		const start = Date.now()

		this.info(`${operation} started`, context, fields)

		try {
			const value = await run()

			this.info(`${operation} completed`, context, {
				...fields,
				...options.result?.(value),
				duration: Date.now() - start,
			})

			return value
		} catch (error) {
			if (!options.expected?.(error))
				this.error(`${operation} failed`, context, toError(error), {
					...fields,
					duration: Date.now() - start,
				})

			throw error
		}
	}
}
