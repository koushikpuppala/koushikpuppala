import type { RequestContextData } from 'types/server'

import { AsyncLocalStorage } from 'node:async_hooks'

export const requestContextStorage = new AsyncLocalStorage<RequestContextData>()
