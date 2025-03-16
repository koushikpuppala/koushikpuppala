export type LoggerType = Readonly<{
	_production: boolean
	_isClient: boolean
	info: (message: string, functionName: string, meta?: Record<string, any>) => void
	debug: (message: string, functionName: string, meta?: Record<string, any>) => void
	warn: (message: string, functionName: string, meta?: Record<string, any>) => void
	error: (message: string, functionName: string, error?: Error, meta?: Record<string, any>) => void
	fatal: (message: string, functionName: string, error?: Error, meta?: Record<string, any>) => void
}>
