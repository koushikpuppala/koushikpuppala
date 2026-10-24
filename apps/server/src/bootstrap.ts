import type { INestApplication } from '@nestjs/common'

import helmet from 'helmet'
import compression from 'compression'
import { Reflector } from '@nestjs/core'
import { Configuration } from 'config/configuration'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { ResponseInterceptor } from 'common/interceptors/response.interceptor'
import { RequestIdMiddleware } from 'common/middlewares/request-id.middleware'
import { RequestContextMiddleware } from 'common/middlewares/request-context.middleware'

// Shared by main.ts and the integration tests, so both run the app with the same middleware and pipes.
export const configureApp = (app: INestApplication): INestApplication => {
	const express = app.getHttpAdapter().getInstance()
	const settings = app.get(Configuration)

	// Needed behind the load balancer so req.ip and req.protocol reflect the real client.
	express.set('trust proxy', settings.trustProxy)

	// CORS answers preflight requests before helmet runs, so the framework header is turned off here too.
	express.disable('x-powered-by')

	// Order matters: the request context reads the request id that the first middleware sets.
	app.use(new RequestIdMiddleware().use)
	app.use(new RequestContextMiddleware().use)

	// Auth is a bearer header, never a cookie, so cross-origin requests are not allowed to carry credentials.
	app.enableCors({
		origin: settings.origin,
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
	})

	app.setGlobalPrefix('api')

	app.use(compression({ threshold: '1kb' }))

	app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' })

	app.use(
		helmet({
			// The API only returns JSON, so its responses may load nothing. The docs pages, which exist
			// outside production only, get their own relaxed policy in main.ts.
			contentSecurityPolicy: {
				useDefaults: false,
				directives: {
					defaultSrc: ["'none'"],
					frameAncestors: ["'none'"],
					baseUri: ["'none'"],
					formAction: ["'none'"],
				},
			},
			crossOriginEmbedderPolicy: false,
			// The client and admin apps run on other origins and must be able to read API responses.
			crossOriginResourcePolicy: { policy: 'cross-origin' },
		}),
	)

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			// Reject any field a DTO does not declare instead of silently dropping it.
			whitelist: true,
			forbidNonWhitelisted: true,
			transformOptions: { enableImplicitConversion: true },
		}),
	)

	app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)))

	return app
}
