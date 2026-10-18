import type { ApiEndpointOptions } from 'types/server'

import { applyDecorators, type Type } from '@nestjs/common'
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

const statusMap: Record<ApiEndpointOptions['method'], number> = {
	GET: 200,
	POST: 201,
	PUT: 200,
	PATCH: 200,
	DELETE: 204,
}

const ENVELOPE = {
	requestId: '7b4c7b17-f...',
	timestamp: '2026-07-12T10:15:30.000Z',
}

const PAGINATION_SCHEMA = {
	type: 'object',
	properties: {
		page: { type: 'number', example: 1 },
		limit: { type: 'number', example: 10 },
		total: { type: 'number', example: 100 },
		totalPages: { type: 'number', example: 10 },
	},
}

const errorExample = (statusCode: number, message: string, endpoint: string) => ({
	schema: { example: { error: true, statusCode, message, endpoint, ...ENVELOPE } },
})

const resultSchema = (type: Type<unknown>, isArray: boolean, isPaginated: boolean) => {
	const item = { $ref: getSchemaPath(type) }

	if (isPaginated)
		return {
			type: 'object',
			properties: { items: { type: 'array', items: item }, pagination: PAGINATION_SCHEMA },
		}

	return isArray ? { type: 'array', items: item } : item
}

// Documents an endpoint with the ResponseInterceptor envelope around its result, plus the
// error responses it can return, so each controller method needs a single decorator.
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
	const statusCode = statusMap[method]

	const success = {
		message: 'Request successful.',
		statusCode,
		endpoint,
		...ENVELOPE,
	}

	return applyDecorators(
		...(type ? [ApiExtraModels(type)] : []),
		...(auth ? [ApiBearerAuth()] : []),
		ApiOperation({ summary, description }),
		ApiOkResponse({
			description: 'Request successful.',
			schema: type
				? {
						allOf: [
							{
								type: 'object',
								properties: Object.fromEntries(
									Object.entries(success).map(([key, example]) => [
										key,
										{ type: typeof example, example },
									]),
								),
							},
							{
								type: 'object',
								properties: {
									result: resultSchema(type, isArray, isPaginated),
									count: { type: 'number', example: 1 },
								},
							},
						],
					}
				: {
						example: {
							...success,
							result: isPaginated ? { items: [], pagination: {} } : isArray ? [] : {},
						},
					},
		}),
		...(badRequest
			? [
					ApiBadRequestResponse({
						description: 'Validation failed.',
						...errorExample(400, 'Validation failed.', endpoint),
					}),
				]
			: []),
		...(unauthorized && auth
			? [
					ApiUnauthorizedResponse({
						description: 'Unauthorized.',
						...errorExample(401, 'Invalid or expired authentication token', endpoint),
					}),
				]
			: []),
		...(forbidden && auth
			? [
					ApiForbiddenResponse({
						description: 'Forbidden.',
						...errorExample(403, 'You do not have permission to access this resource.', endpoint),
					}),
				]
			: []),
		...(notFound
			? [
					ApiNotFoundResponse({
						description: 'Resource not found.',
						...errorExample(404, 'Resource not found.', endpoint),
					}),
				]
			: []),
		...(internalServerError
			? [
					ApiInternalServerErrorResponse({
						description: 'Internal server error.',
						...errorExample(500, 'Internal Server Error', endpoint),
					}),
				]
			: []),
	)
}
