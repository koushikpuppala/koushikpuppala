'use cache'

import type { GetAbout, GetAllAbout } from 'types/actions'

import { prisma } from 'prisma'
import { Result } from 'lib/result'

export const getAbout: GetAbout = async () => {
	try {
		const result = await prisma.about.findFirst({
			where: { deletedAt: null },
			select: { title: true, introduction: true },
		})

		if (!result) return Result.notFound('About information not found', 'getAbout')

		return Result.success('About information retrieved successfully', 'getAbout', result)
	} catch (error) {
		return Result.internalServerError(
			'Failed to retrieve about information',
			'getAbout',
			error as Error,
		)
	}
}

export const getAllAbout: GetAllAbout = async args => {
	const { page = 1, count = 10, nonPaginated = false, where, orderBy, select } = args

	try {
		const [result, totalCount] = await Promise.all([
			prisma.about.findMany({
				...(nonPaginated ? {} : { skip: (page - 1) * count, take: count }),
				where,
				orderBy,
				select,
			}),
			prisma.about.count({ where }),
		])

		return Result.success(
			'All about information retrieved successfully',
			'getAllAbout',
			result,
			totalCount,
		)
	} catch (error) {
		return Result.internalServerError(
			'Failed to retrieve all about information',
			'getAllAbout',
			error as Error,
		)
	}
}
