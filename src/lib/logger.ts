import 'winston-daily-rotate-file'

import type { LoggerType } from 'types/lib'

import { createLogger, format, transports } from 'winston'
import { existsSync, mkdirSync } from 'fs'
import * as Sentry from '@sentry/nextjs'

export class Logger implements LoggerType {
	readonly _production: boolean = process.env.NODE_ENV === 'production'
	readonly _isClient: boolean = typeof window !== 'undefined'
	private _enableSentry: boolean = !!process.env.ENABLE_SENTRY && this._production
	private _logDir: string = process.env.LOG_DIR ?? 'logs'
	private _logger
	private _normalizeError: (error?: Error) => string | Error | undefined
	private _log: (
		level: string,
		message: string,
		functionName: string,
		meta?: Record<string, unknown>,
		error?: Error,
	) => void
	private _sentry: (
		level: Sentry.SeverityLevel,
		message: string,
		functionName: string,
		meta?: Record<string, unknown>,
		error?: Error,
	) => void

	constructor() {
		// Ensure the logs directory exists (server-side only)
		if (!this._isClient && !existsSync(this._logDir)) mkdirSync(this._logDir)

		this._logger = this._isClient
			? console
			: createLogger({
					level: this._production ? 'info' : 'debug',
					format: format.combine(
						this._production ? format.uncolorize() : format.colorize(),
						format.timestamp({ format: this._production ? 'DD MMM YYYY hh:mm:ss A' : 'hh:mm A' }),
						this._production ? format.prettyPrint({ colorize: true, depth: 3 }) : format.simple(),
						this._production ? format.errors({ stack: true }) : format.errors({ stack: false }),
					),
					handleExceptions: true,
					transports: [
						this._production
							? new transports.DailyRotateFile({
									filename: '%DATE%-application.log',
									datePattern: 'DD-MM-YYYY',
									dirname: this._logDir,
									watchLog: true,
									maxSize: '10m',
									maxFiles: '7d',
									json: true,
								})
							: new transports.Console(),
					],
				})

		this._normalizeError = error => {
			if (!error) return undefined
			return this._production
				? error
				: { name: error.name, message: error.message, stack: error.stack }
		}

		this._log = (level, message, functionName, meta, error) => {
			const data = { functionName, ...meta, timestamp: new Date().toISOString() }

			if (this._isClient) {
				if (error) console.error(message, { error: this._normalizeError(error), ...data })
				else console.log(message, data)
			} else {
				if (error)
					this._logger.log(level, message, {
						error: this._normalizeError(error),
						...data,
					})
				else this._logger.log(level, message, data)
			}
		}

		this._sentry = (level, message, functionName, meta, error) => {
			if (!this._enableSentry) return
			Sentry.captureException(error, { tags: { functionName, level }, extra: { message, ...meta } })
		}
	}

	readonly info: LoggerType['info'] = (message, functionName, meta) =>
		this._log('info', message, functionName, meta)

	readonly debug: LoggerType['debug'] = (message, functionName, meta) =>
		this._log('debug', message, functionName, meta)

	readonly warn: LoggerType['warn'] = (message, functionName, meta) =>
		this._log('warn', message, functionName, meta)

	readonly error: LoggerType['error'] = (message, functionName, error, meta) => {
		this._log('error', message, functionName, meta, error)
		this._sentry('error', message, functionName, meta, error)
	}

	readonly fatal: LoggerType['fatal'] = (message, functionName, error, meta) => {
		this._log('fatal', message, functionName, meta, error)
		this._sentry('fatal', message, functionName, meta, error)

		if (!this._isClient) process.exit(1)
	}
}

export const logger = new Logger()
