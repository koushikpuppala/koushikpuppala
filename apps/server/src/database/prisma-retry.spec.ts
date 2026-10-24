import { Prisma } from '@repo/prisma'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { withPrismaRetry } from './prisma-retry'

const known = (code: string) =>
	new Prisma.PrismaClientKnownRequestError('db error', { code, clientVersion: 'test' })

describe('withPrismaRetry', () => {
	beforeEach(() => vi.useFakeTimers())
	afterEach(() => vi.useRealTimers())

	const run = async <T>(promise: Promise<T>) => {
		await vi.runAllTimersAsync()
		return promise
	}

	it('returns the first successful result', async () => {
		await expect(run(withPrismaRetry(async () => 'ok'))).resolves.toBe('ok')
	})

	it.each([
		['a transient Prisma code', known('P1001')],
		['an unreachable server message', new Error("Can't reach database server at db:5432")],
		['a connection timeout message', new Error('connection timeout')],
		['a closed connection message', new Error('Connection closed')],
	])('retries %s with backoff until it succeeds', async (_, error) => {
		const fn = vi.fn().mockRejectedValueOnce(error).mockRejectedValueOnce(error).mockResolvedValue('ok')

		await expect(run(withPrismaRetry(fn))).resolves.toBe('ok')
		expect(fn).toHaveBeenCalledTimes(3)
	})

	it('gives up after the last attempt and rethrows', async () => {
		const fn = vi.fn().mockRejectedValue(known('P1017'))

		const result = withPrismaRetry(fn, 2, 10)
		const assertion = expect(result).rejects.toThrow('db error')
		await vi.runAllTimersAsync()
		await assertion
		expect(fn).toHaveBeenCalledTimes(2)
	})

	it('rethrows query errors at once', async () => {
		const fn = vi.fn().mockRejectedValue(known('P2002'))

		await expect(withPrismaRetry(fn)).rejects.toThrow('db error')
		expect(fn).toHaveBeenCalledTimes(1)
	})

	it('rethrows non errors at once', async () => {
		const fn = vi.fn().mockRejectedValue('plain string')

		await expect(withPrismaRetry(fn)).rejects.toBe('plain string')
		expect(fn).toHaveBeenCalledTimes(1)
	})

	it('runs once more when no attempts are allowed', async () => {
		await expect(withPrismaRetry(async () => 'last', 0)).resolves.toBe('last')
	})
})
