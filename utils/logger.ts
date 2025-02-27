import 'winston-daily-rotate-file'

import { createLogger, format, transports, Logger as WinstonLogger } from 'winston'
import { existsSync, mkdirSync } from 'fs'
import * as Sentry from '@sentry/nextjs'

export class Logger {
	private _production: boolean
	private _isClient: boolean
	private _enableSentry: boolean
	private _logger: WinstonLogger | Console
	private _sentry: (
		level: Sentry.SeverityLevel,
		message: string,
		functionName: string,
		error?: Error,
		meta?: Record<string, any>,
	) => void

	constructor() {
		this._production = process.env.NODE_ENV === 'production'
		this._isClient = typeof window !== 'undefined'
		this._enableSentry = !!process.env.ENABLE_SENTRY && this._production

		const logDir = process.env.LOG_DIR ?? 'logs'

		// Ensure the logs directory exists (server-side only)
		if (!this._isClient && !existsSync(logDir)) mkdirSync(logDir)

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
									dirname: logDir,
									watchLog: true,
									maxSize: '10m',
									maxFiles: '7d',
									json: true,
								})
							: new transports.Console(),
					],
				})

		this._sentry = (level, message, functionName, error, meta?) => {
			if (!this._enableSentry) return
			Sentry.captureException(error, { tags: { functionName, level }, extra: { message, ...meta } })
		}
	}

	private _normalizeError: (error?: Error) => string | Error | undefined = error => {
		if (!error) return undefined
		return this._production
			? error
			: { name: error.name, message: error.message, stack: error.stack }
	}

	private _log(
		level: string,
		message: string,
		functionName: string,
		meta?: Record<string, any>,
		error?: Error,
	) {
		const data = { functionName, ...meta }

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

	info(message: string, functionName: string, meta?: Record<string, any>): void {
		this._log('info', message, functionName, meta)
	}

	debug(message: string, functionName: string, meta?: Record<string, any>): void {
		this._log('debug', message, functionName, meta)
	}

	warn(message: string, functionName: string, meta?: Record<string, any>): void {
		this._log('warn', message, functionName, meta)
	}

	error(message: string, functionName: string, error?: Error, meta?: Record<string, any>): void {
		this._log('error', message, functionName, meta, error)
		this._sentry('error', message, functionName, error, meta)
	}

	fatal(message: string, functionName: string, error?: Error, meta?: Record<string, any>): void {
		this._log('fatal', message, functionName, meta, error)
		this._sentry('fatal', message, functionName, error, meta)

		if (!this._isClient) process.exit(1)
	}
}

export const logger = new Logger()
