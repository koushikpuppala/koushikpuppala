export type LoggerType = Readonly<{
	_production: boolean
	_isClient: boolean
	info: (message: string, functionName: string, meta?: Record<string, unknown>) => void
	debug: (message: string, functionName: string, meta?: Record<string, unknown>) => void
	warn: (message: string, functionName: string, meta?: Record<string, unknown>) => void
	error: (
		message: string,
		functionName: string,
		error?: Error,
		meta?: Record<string, unknown>,
	) => void
	fatal: (
		message: string,
		functionName: string,
		error?: Error,
		meta?: Record<string, unknown>,
	) => void
}>

export type ServerActionResponse<T> = {
	error: boolean
	code: number
	message: string
	result?: T
	totalCount?: number
}
