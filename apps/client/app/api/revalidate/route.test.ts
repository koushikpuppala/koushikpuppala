// @vitest-environment node
import { POST } from './route'
import { revalidateTag } from 'next/cache'
import { describe, expect, it } from 'vitest'

const request = (body: unknown, secret?: string) =>
	new Request('http://site.test/api/revalidate', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			...(secret && { 'x-revalidate-secret': secret }),
		},
		body: JSON.stringify(body),
	})

describe('POST /api/revalidate', () => {
	it.each([undefined, 'wrong-secret'])('rejects secret %s', async secret => {
		const res = await POST(request({ tags: ['projects'] }, secret))

		expect(res.status).toBe(401)
		expect(revalidateTag).not.toHaveBeenCalled()
	})

	it('refreshes only known content tags', async () => {
		const res = await POST(request({ tags: ['projects', 'unknown', 42, 'skills'] }, 'test-secret'))

		expect(res.status).toBe(200)
		expect(await res.json()).toEqual({ success: true, revalidated: ['projects', 'skills'] })
		expect(revalidateTag).toHaveBeenCalledTimes(2)
		expect(revalidateTag).toHaveBeenCalledWith('projects', { expire: 0 })
	})

	it('returns 400 when no known tag is given', async () => {
		const res = await POST(request({ tags: ['nope'] }, 'test-secret'))

		expect(res.status).toBe(400)
		expect(revalidateTag).not.toHaveBeenCalled()
	})
})
