import 'dotenv/config'

// Sentry must be initialised before any other module is imported so it can instrument them.
import './instrument'

import redoc from 'redoc-express'
import { AppModule } from './app.module'
import { NestFactory } from '@nestjs/core'
import { configureApp } from './bootstrap'
import { Configuration } from 'config/configuration'
import { LoggerService } from 'common/logger/logger.service'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

const bootstrap = async () => {
	// rawBody keeps the unparsed request body available for handlers that need the exact bytes.
	const app = await NestFactory.create(AppModule, { rawBody: true })

	const logger = app.get(LoggerService)
	const settings = app.get(Configuration)

	configureApp(app)

	app.enableShutdownHooks()

	// Route Nest's internal logs through Winston so they share the same format, files and redaction.
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

	// API docs are only exposed outside production.
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
