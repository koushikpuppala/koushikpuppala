// @vitest-environment node
import { POST } from './route'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { API, server } from '../../../test/msw'

const valid = {
	name: 'Ada Lovelace',
	email: 'ada@example.com',
	subject: 'Project',
	message: 'I would like to talk about a project.',
}

const request = (body: unknown, headers: Record<string, string> = {}) =>
	new Request('http://site.test/api/contact', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', ...headers },
		body: JSON.stringify(body),
	})

describe('POST /api/contact', () => {
	it('rejects invalid input with field errors', async () => {
		const res = await POST(request({ ...valid, email: 'not-an-email', message: 'short' }))
		const body = await res.json()

		expect(res.status).toBe(400)
		expect(Object.keys(body.errors)).toEqual(expect.arrayContaining(['email', 'message']))
	})

	it.each([
		['invalid JSON', 'not json'],
		['a null body', 'null'],
		['a non-string field', JSON.stringify({ ...valid, name: 42 })],
	])('answers %s as malformed', async (_label, raw) => {
		const res = await POST(
			new Request('http://site.test/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: raw,
			}),
		)

		expect(res.status).toBe(400)
		expect((await res.json()).message).toBe('Malformed request payload received.')
	})

	it('answers the honeypot without reaching the API', async () => {
		const res = await POST(request({ ...valid, url: 'http://spam.example' }))

		expect(res.status).toBe(200)
		expect((await res.json()).success).toBe(true)
	})

	it('forwards a valid message with only the closest proxy IP', async () => {
		let forwardedFor: string | null = null
		let sent: unknown = null
		server.use(
			http.post(`${API}/api/v1/contacts`, async ({ request: apiRequest }) => {
				forwardedFor = apiRequest.headers.get('x-forwarded-for')
				sent = await apiRequest.json()
				return HttpResponse.json({ result: { id: 'c1' } }, { status: 201 })
			}),
		)

		const res = await POST(request(valid, { 'x-forwarded-for': '6.6.6.6, 203.0.113.9' }))

		expect(res.status).toBe(201)
		expect(forwardedFor).toBe('203.0.113.9')
		expect(sent).toEqual({ ...valid, source: 'website' })
	})

	it('forwards the reCAPTCHA token for the API to verify', async () => {
		let sent: unknown = null
		server.use(
			http.post(`${API}/api/v1/contacts`, async ({ request: apiRequest }) => {
				sent = await apiRequest.json()
				return HttpResponse.json({ result: { id: 'c2' } }, { status: 201 })
			}),
		)

		await POST(request({ ...valid, recaptchaToken: 'token-123' }))

		expect(sent).toEqual({ ...valid, source: 'website', recaptchaToken: 'token-123' })
	})

	it('passes API failures through', async () => {
		server.use(
			http.post(`${API}/api/v1/contacts`, () =>
				HttpResponse.json({ message: 'ThrottlerException: Too Many Requests' }, { status: 429 }),
			),
		)

		const res = await POST(request(valid))

		expect(res.status).toBe(429)
		expect((await res.json()).message).toContain('Too Many Requests')
	})

	it('returns 503 when the API is unreachable', async () => {
		server.use(http.post(`${API}/api/v1/contacts`, () => HttpResponse.error()))

		const res = await POST(request(valid))

		expect(res.status).toBe(503)
	})
})
