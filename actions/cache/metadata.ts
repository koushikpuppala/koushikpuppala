'use cache'

import type { GetAllMetadataArgs, GetMetadataArgs } from '@import/types'

import { prisma } from '@import/prisma'
import { Result } from '@import/lib'

export const getMetadata: GetMetadataArgs = async args => {
	const { key, type } = args

	try {
		const result = await prisma.metadata.findUnique({
			where: { key, type, deletedAt: null },
			select: { title: true, description: true, keywords: true },
		})

		if (!result) return Result.notFound('Metadata not found', 'getMetadata')

		return Result.success('Metadata retrieved successfully', 'getMetadata', result)
	} catch (error) {
		return Result.internalServerError('Failed to retrieve metadata', 'getMetadata', error as Error)
	}
}

export const getAllMetadata: GetAllMetadataArgs = async args => {
	const { page = 1, count = 10, nonPaginated = false, where, orderBy, select } = args

	try {
		const [result, totalCount] = await Promise.all([
			prisma.metadata.findMany({
				...(nonPaginated ? {} : { skip: (page - 1) * count, take: count }),
				where,
				orderBy,
				select,
			}),
			prisma.metadata.count({ where }),
		])

		return Result.success(
			'All metadata retrieved successfully',
			'getAllMetadata',
			result,
			nonPaginated ? undefined : totalCount,
		)
	} catch (error) {
		return Result.internalServerError(
			'Failed to retrieve all metadata',
			'getAllMetadata',
			error as Error,
		)
	}
}
