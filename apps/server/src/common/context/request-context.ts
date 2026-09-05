import { AsyncLocalStorage } from 'node:async_hooks'

export type RequestContextData = {
	userId?: string
	ipAddress?: string
	userAgent?: string
	requestId?: string
}

export const requestContextStorage = new AsyncLocalStorage<RequestContextData>()
