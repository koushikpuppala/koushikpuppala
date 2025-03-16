export const debounce = <T extends (...args: Parameters<T>) => ReturnType<T>>(
	func: T,
	wait = 0,
	options: { leading?: boolean; trailing?: boolean; maxWait?: number } = {},
) => {
	let timeout: ReturnType<typeof setTimeout> | null = null
	let maxTimeout: ReturnType<typeof setTimeout> | null = null
	let lastArgs: Parameters<T> | null = null
	let lastThis: ThisParameterType<T> | null = null
	let lastInvokeTime = 0
	let result: ReturnType<T> | undefined

	const invoke = (time: number) => {
		lastInvokeTime = time
		if (lastArgs) {
			result = func.apply(lastThis, lastArgs)
			lastArgs = lastThis = null
		}
		timeout = null
	}

	const shouldInvoke = (time: number) => {
		return (
			lastInvokeTime === 0 ||
			time - lastInvokeTime >= wait ||
			(options.maxWait !== undefined && time - lastInvokeTime >= options.maxWait)
		)
	}

	const debounced = (...args: Parameters<T>) => {
		const now = Date.now()
		const isInvoking = shouldInvoke(now)

		lastArgs = args
		lastThis = this ?? null

		if (isInvoking && options.leading) {
			invoke(now)
		}

		if (timeout) clearTimeout(timeout)
		if (maxTimeout) clearTimeout(maxTimeout)

		timeout = setTimeout(() => {
			if (options.trailing !== false && lastArgs) invoke(Date.now())
		}, wait)

		if (options.maxWait !== undefined) {
			maxTimeout = setTimeout(() => {
				if (lastArgs) invoke(Date.now())
			}, options.maxWait)
		}

		return result
	}

	debounced.cancel = () => {
		if (timeout) clearTimeout(timeout)
		if (maxTimeout) clearTimeout(maxTimeout)
		timeout = maxTimeout = lastArgs = lastThis = null
	}

	debounced.flush = () => {
		if (timeout) {
			clearTimeout(timeout)
			invoke(Date.now())
		}
	}

	return debounced
}
