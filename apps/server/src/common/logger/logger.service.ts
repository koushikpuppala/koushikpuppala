import 'winston-daily-rotate-file'

import * as Sentry from '@sentry/nestjs'
import { Injectable } from '@nestjs/common'
import { existsSync, mkdirSync } from 'node:fs'
import { Configuration } from 'config/configuration'
import { createLogger, format, transports } from 'winston'

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
					filename: 'application-%DATE%.log',
					datePattern: 'YYYY-MM-DD',
					dirname: this.config.logger.dir,
					maxFiles: '30d',
					maxSize: '20m',
				}),

				new transports.DailyRotateFile({
					filename: 'error-%DATE%.log',
					datePattern: 'YYYY-MM-DD',
					dirname: this.config.logger.dir,
					maxFiles: '30d',
					maxSize: '20m',
					level: 'error',
				}),

				new transports.DailyRotateFile({
					filename: 'audit-%DATE%.log',
					datePattern: 'YYYY-MM-DD',
					dirname: this.config.logger.dir,
					maxFiles: '90d',
					maxSize: '20m',
					level: 'info',
				}),
			],
		})
	}

	private captureSentry(
		level: Sentry.SeverityLevel,
		message: string,
		context: string,
		meta?: Record<string, unknown>,
		error?: Error,
	) {
		if (!this.config.sentry.enabled) return

		Sentry.withScope(scope => {
			scope.setLevel(level)
			scope.setTag('context', context)

			if (meta) scope.setExtras(meta)

			if (error) Sentry.captureException(error)
			else Sentry.captureMessage(message)
		})
	}

	info(message: string, context: string, meta?: Record<string, unknown>) {
		this.logger.info({ message, context, ...meta })
	}

	debug(message: string, context: string, meta?: Record<string, unknown>) {
		this.logger.debug({ message, context, ...meta })
	}

	warn(message: string, context: string, meta?: Record<string, unknown>) {
		this.logger.warn({ message, context, ...meta })
	}

	error(message: string, context: string, error?: Error, meta?: Record<string, unknown>) {
		this.logger.error({ message, context, error: error?.stack, ...meta })

		this.captureSentry('error', message, context, meta, error)
	}

	fatal(message: string, context: string, error?: Error, meta?: Record<string, unknown>) {
		this.logger.error({ message, context, error: error?.stack, ...meta, fatal: true })

		this.captureSentry('fatal', message, context, meta, error)

		process.exit(1)
	}

	audit(action: string, entity: string, entityId: string, meta?: Record<string, unknown>) {
		this.logger.info({ type: 'audit', action, entity, entityId, ...meta })
	}
}
