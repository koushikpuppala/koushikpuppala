import './instrument'

import 'dotenv/config'

import helmet from 'helmet'
import redoc from 'redoc-express'
import compression from 'compression'
import { AppModule } from './app.module'
import { Configuration } from 'config/configuration'
import { NestFactory, Reflector } from '@nestjs/core'
import { LoggerService } from 'common/logger/logger.service'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ResponseInterceptor } from 'common/interceptors/response.interceptor'
import { RequestIdMiddleware } from 'common/middlewares/request-id.middleware'
import { RequestContextMiddleware } from 'common/middlewares/request-context.middleware'

const bootstrap = async () => {
	const app = await NestFactory.create(AppModule, { rawBody: true })

	const express = app.getHttpAdapter().getInstance()
	const logger = app.get(LoggerService)
	const settings = app.get(Configuration)

	express.set('trust proxy', true)

	app.use(new RequestIdMiddleware().use)
	app.use(new RequestContextMiddleware().use)

	app.enableShutdownHooks()

	app.enableCors({
		credentials: true,
		origin: settings.origin,
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
	})

	app.setGlobalPrefix('api')

	app.use(compression({ threshold: '1kb' }))

	app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' })

	app.use(
		helmet({
			contentSecurityPolicy: false,
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

	app.useLogger({
		log: message => logger.info(message, 'Application/Nest'),

		error: (message, trace) =>
			logger.error(message, 'Application/Nest', trace ? new Error(trace) : undefined),

		warn: message => logger.warn(message, 'Application/Nest'),

		debug: message => logger.debug(message, 'Application/Nest'),

		verbose: message => logger.debug(message, 'Application/Nest'),
	})

	const config = new DocumentBuilder()
		.setTitle('Koushik Puppala (Individual Contributor)')
		.setVersion('1.0.0')
		.setDescription('API Documentation')
		.addServer('/', 'Default API endpoints')
		.addBearerAuth(
			{
				type: 'http',
				scheme: 'Bearer',
				bearerFormat: 'JWT',
				description: 'Provide a Firebase ID Token in the format: Bearer <Firebase ID Token>',
			},
			'Authorization',
		)
		.setContact(
			'Koushik Puppala',
			'https://koushikpuppala.com',
			'koushikpuppala@koushikpuppala.com',
		)
		.setLicense('MIT', 'https://opensource.org/licenses/MIT')
		.build()

	const document = SwaggerModule.createDocument(app, config)

	if (settings.environment !== 'production') {
		SwaggerModule.setup('api/docs', app, document)

		app.getHttpAdapter().get('/api/docs/openapi.json', (_, res) => {
			res.setHeader('Content-Type', 'application/json')
			res.json(document)
		})

		app.use(
			'/api/docs/v2',
			redoc({
				title: 'Koushik Puppala (Individual Contributor)',
				specUrl: '/api/docs/openapi.json',
			}),
		)
	}

	await app.listen(settings.port)

	logger.info('Server started', 'Bootstrap', {
		pid: process.pid,
		version: '1.0.0',
		port: settings.port,
		environment: settings.environment,
	})
}

void bootstrap()
