import 'dotenv/config'

// Must load before the app modules so Sentry can instrument them.
import './instrument'

import helmet from 'helmet'
import redoc from 'redoc-express'
import { AppModule } from './app.module'
import { NestFactory } from '@nestjs/core'
import { configureApp } from './bootstrap'
import { APP_VERSION } from 'config/version'
import { Configuration } from 'config/configuration'
import { LoggerService } from 'common/logger/logger.service'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

const bootstrap = async () => {
	const app = await NestFactory.create(AppModule, { rawBody: true })

	const logger = app.get(LoggerService)
	const settings = app.get(Configuration)

	configureApp(app)

	app.enableShutdownHooks()

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
		.setVersion(APP_VERSION)
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
		app.use(
			'/api/docs',
			helmet.contentSecurityPolicy({
				directives: {
					defaultSrc: ["'self'"],
					scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
					styleSrc: ["'self'", "'unsafe-inline'"],
					imgSrc: ["'self'", 'data:', 'https:'],
					fontSrc: ["'self'", 'https:', 'data:'],
					connectSrc: ["'self'", 'https:'],
					frameAncestors: ["'none'"],
					baseUri: ["'self'"],
					formAction: ["'self'"],
				},
			}),
		)

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
		version: APP_VERSION,
		port: settings.port,
		environment: settings.environment,
	})
}

void bootstrap()
