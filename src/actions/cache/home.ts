'use cache'

import type { GetAllHome, GetHome } from 'types/actions'

import { prisma } from 'prisma'
import { Result } from 'lib/result'

export const getHome: GetHome = async () => {
	try {
		const result = await prisma.home.findFirst({
			where: { isPublished: true, deletedAt: null },
			select: { title: true, subtitles: true, separator: true, content: true },
		})

		if (!result) return Result.notFound('Home information not found', 'getHome')

		return Result.success('Home information retrieved successfully', 'getHome', result)
	} catch (error) {
		return Result.internalServerError(
			'Failed to retrieve home information',
			'getHome',
			error as Error
		)
	}
}

export const getAllHome: GetAllHome = async (args) => {
	const { page = 1, count = 10, nonPaginated = false, where, orderBy, select } = args

	console.log('getAllHome args:', args)

	try {
		const [result, totalCount] = await Promise.all([
			prisma.home.findMany({
				...(nonPaginated ? {} : { skip: (page - 1) * count, take: count }),
				...(where ? { where } : {}),
				...(orderBy ? { orderBy } : {}),
				...(select ? { select } : {}),
			}),
			prisma.home.count({
				...(where ? { where } : {}),
			}),
		])

		return Result.success(
			'All home information retrieved successfully',
			'getAllHome',
			result,
			totalCount
		)
	} catch (error) {
		console.log('getAllHome error:', error)
		return Result.internalServerError(
			'Failed to retrieve all home information',
			'getAllHome',
			error as Error
		)
	}
}
