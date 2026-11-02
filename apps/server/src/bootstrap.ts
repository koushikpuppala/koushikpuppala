import type { INestApplication } from '@nestjs/common'

import helmet from 'helmet'
import compression from 'compression'
import { Reflector } from '@nestjs/core'
import { Configuration } from 'config/configuration'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { ResponseInterceptor } from 'common/interceptors/response.interceptor'
import { RequestIdMiddleware } from 'common/middlewares/request-id.middleware'
import { RequestContextMiddleware } from 'common/middlewares/request-context.middleware'

export const configureApp = (app: INestApplication): INestApplication => {
	const express = app.getHttpAdapter().getInstance()
	const settings = app.get(Configuration)

	// Behind nginx and CloudFront, req.ip comes from forwarded headers; TRUST_PROXY decides whom to
	// believe.
	express.set('trust proxy', settings.trustProxy)

	express.disable('x-powered-by')

	app.use(new RequestIdMiddleware().use)
	app.use(new RequestContextMiddleware().use)

	// Auth is a bearer header rather than a cookie, so credentials are deliberately not enabled.
	app.enableCors({
		origin: settings.origin,
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
	})

	app.setGlobalPrefix('api')

	app.use(compression({ threshold: '1kb' }))

	app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' })

	app.use(
		helmet({
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
			crossOriginResourcePolicy: { policy: 'cross-origin' },
		}),
	)

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			forbidNonWhitelisted: true,
			transformOptions: { enableImplicitConversion: true },
		}),
	)

	app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)))

	return app
}
