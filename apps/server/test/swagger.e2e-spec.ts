import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { bootApp, type TestApp } from './helpers'

describe('Swagger document (e2e)', () => {
	let t: TestApp

	beforeAll(async () => {
		t = await bootApp()
	})
	afterAll(() => t.app.close())

	it('documents every route with the real response envelope', () => {
		const document = SwaggerModule.createDocument(t.app, new DocumentBuilder().build())
		const services = document.paths['/api/v1/services']?.get

		expect(Object.keys(document.paths).length).toBeGreaterThan(40)
		expect(services?.responses['200']).toBeDefined()
		expect(services?.responses['401']).toMatchObject({
			content: { 'application/json': { schema: { example: { error: true, statusCode: 401 } } } },
		})
	})
})
