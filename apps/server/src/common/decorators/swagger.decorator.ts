import { applyDecorators, Type } from '@nestjs/common'
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiExtraModels,
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiUnauthorizedResponse,
	getSchemaPath,
} from '@nestjs/swagger'

export interface ApiEndpointOptions {
	summary: string
	description?: string
	type?: Type<unknown>
	auth?: boolean
	endpoint?: string
	isArray?: boolean
	notFound?: boolean
	badRequest?: boolean
	forbidden?: boolean
	isPaginated?: boolean
	unauthorized?: boolean
	internalServerError?: boolean
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
}

const statusMap: Record<ApiEndpointOptions['method'], number> = {
	GET: 200,
	POST: 201,
	PUT: 200,
	PATCH: 200,
	DELETE: 204,
}

export const ApiEndpoint = ({
	type,
	method,
	summary,
	description,
	auth = true,
	isArray = false,
	notFound = false,
	badRequest = true,
	forbidden = true,
	isPaginated = false,
	unauthorized = true,
	internalServerError = true,
	endpoint = 'GET /api/v1/users',
}: ApiEndpointOptions) => {
	const decorators = []

	const status = statusMap[method]

	if (type) decorators.push(ApiExtraModels(type))

	decorators.push(
		...(auth ? [ApiBearerAuth()] : []),

		ApiOperation({ summary, description }),

		ApiOkResponse({
			description: 'Request successful.',
			schema: type
				? {
						allOf: [
							{
								type: 'object',
								properties: {
									success: { type: 'boolean', example: true },
									statusCode: { type: 'number', example: status },
									message: { type: 'string', example: 'Request successful.' },
									requestId: { type: 'string', example: '7b4c7b17-f...' },
									timestamp: {
										type: 'string',
										format: 'date-time',
										example: '2026-07-12T10:15:30.000Z',
									},
									ip: { type: 'string', example: '127.0.0.1' },
									endpoint: { type: 'string', example: endpoint },
								},
							},
							{
								type: 'object',
								properties: {
									data: isArray
										? { type: 'array', items: { $ref: getSchemaPath(type) } }
										: { $ref: getSchemaPath(type) },
									...(isPaginated && {
										pagination: {
											type: 'object',
											properties: {
												page: { type: 'number', example: 1 },
												limit: { type: 'number', example: 10 },
												total: { type: 'number', example: 100 },
												totalPages: { type: 'number', example: 10 },
											},
										},
									}),
								},
							},
						],
					}
				: {
						example: {
							success: true,
							statusCode: status,
							endpoint,
							message: 'Request successful.',
							requestId: '7b4c7b17-f...',
							timestamp: '2026-07-12T10:15:30.000Z',
							ip: '127.0.0.1',
							data: isArray ? [] : {},
							pagination: isPaginated
								? {
										type: 'object',
										properties: {
											page: { type: 'number', example: 1 },
											limit: { type: 'number', example: 10 },
											total: { type: 'number', example: 100 },
											totalPages: { type: 'number', example: 10 },
										},
									}
								: undefined,
						},
					},
		}),
	)

	if (badRequest)
		decorators.push(
			ApiBadRequestResponse({
				description: 'Validation failed.',
				schema: {
					example: {
						success: false,
						statusCode: 400,
						message: 'Validation failed.',
						requestId: '7b4c7b17-f...',
						timestamp: '2026-07-12T10:15:30.000Z',
						ip: '127.0.0.1',
						endpoint,
					},
				},
			}),
		)

	if (unauthorized && auth)
		decorators.push(
			ApiUnauthorizedResponse({
				description: 'Unauthorized.',
				schema: {
					example: {
						success: false,
						statusCode: 401,
						message: 'Invalid or expired authentication token',
						requestId: '7b4c7b17-f...',
						timestamp: '2026-07-12T10:15:30.000Z',
						ip: '127.0.0.1',
						endpoint,
					},
				},
			}),
		)

	if (forbidden && auth)
		decorators.push(
			ApiForbiddenResponse({
				description: 'Forbidden.',
				schema: {
					example: {
						success: false,
						statusCode: 403,
						message: 'You do not have permission to access this resource.',
						requestId: '7b4c7b17-f...',
						timestamp: '2026-07-12T10:15:30.000Z',
						ip: '127.0.0.1',
						endpoint,
					},
				},
			}),
		)

	if (notFound)
		decorators.push(
			ApiNotFoundResponse({
				description: 'Resource not found.',
				schema: {
					example: {
						success: false,
						statusCode: 404,
						message: 'Resource not found.',
						requestId: '7b4c7b17-f...',
						timestamp: '2026-07-12T10:15:30.000Z',
						ip: '127.0.0.1',
						endpoint,
					},
				},
			}),
		)

	if (internalServerError)
		decorators.push(
			ApiInternalServerErrorResponse({
				description: 'Internal server error.',
				schema: {
					example: {
						success: false,
						statusCode: 500,
						message: 'Internal Server Error',
						requestId: '7b4c7b17-f...',
						timestamp: '2026-07-12T10:15:30.000Z',
						ip: '127.0.0.1',
						endpoint,
					},
				},
			}),
		)

	return applyDecorators(...decorators)
}
