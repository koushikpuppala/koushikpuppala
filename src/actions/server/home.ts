'use server'

import type {
	CreateHome,
	DeleteHome,
	ForceDeleteHome,
	PublishHome,
	UpdateHome,
} from 'types/actions'

import { prisma } from 'prisma'
import { logger } from 'lib/logger'
import { Result } from 'lib/result'
import { verifySession } from 'lib/session'

export const createHome: CreateHome = async args => {
	const { data } = args

	try {
		const authenticated = await verifySession('createHome')

		if (authenticated.error) return authenticated

		logger.info('Creating home entry', 'createHome', { data })

		const home = await prisma.home.create({ data })

		return Result.success('Home entry created successfully', 'createHome', home)
	} catch (error) {
		return Result.internalServerError('Failed to create home entry', 'createHome', error as Error)
	}
}

export const updateHome: UpdateHome = async args => {
	const { where, data } = args

	try {
		const authenticated = await verifySession('updateHome')

		if (authenticated.error) return authenticated

		logger.info('Updating home entry', 'updateHome', { where, data })

		const existingHome = await prisma.home.findFirst({
			where: { ...where, deletedAt: null },
		})

		if (!existingHome) return Result.notFound('Home entry not found', 'updateHome')

		const updatedHome = await prisma.home.update({
			where: { ...where, deletedAt: null },
			data: { ...data, version: { increment: 0.1 } },
		})

		return Result.success('Home entry updated successfully', 'updateHome', updatedHome)
	} catch (error) {
		return Result.internalServerError('Failed to update home entry', 'updateHome', error as Error)
	}
}

export const publishHome: PublishHome = async args => {
	const { where } = args

	try {
		const authenticated = await verifySession('publishHome')

		if (authenticated.error) return authenticated

		logger.info('Publishing home entry', 'publishHome', { where })

		const existingHome = await prisma.home.findFirst({
			where: { ...where, deletedAt: null },
		})
		if (!existingHome) return Result.notFound('Home entry not found', 'publishHome')

		if (existingHome.isPublished)
			return Result.conflict('Home entry is already published', 'publishHome')

		// Unpublish any other published home
		await prisma.home.updateMany({
			where: { isPublished: true, deletedAt: null, NOT: { ...where } },
			data: { isPublished: false, publishedAt: null },
		})

		const publishedHome = await prisma.home.update({
			where: { ...where, deletedAt: null },
			data: { isPublished: true, publishedAt: new Date(), version: { increment: 0.1 } },
		})

		return Result.success('Home entry published successfully', 'publishHome', publishedHome)
	} catch (error) {
		return Result.internalServerError('Failed to publish home entry', 'publishHome', error as Error)
	}
}

export const deleteHome: DeleteHome = async args => {
	const { where } = args

	try {
		const authenticated = await verifySession('deleteHome')

		if (authenticated.error) return authenticated

		logger.info('Deleting home entry', 'deleteHome', { where })

		const existingHome = await prisma.home.findFirst({
			where: { ...where, deletedAt: null },
		})

		if (!existingHome) return Result.notFound('Home entry not found', 'deleteHome')

		await prisma.home.update({
			where: { ...where, deletedAt: null },
			data: { deletedAt: new Date(), version: { increment: 0.1 } },
		})

		return Result.success('Home entry deleted successfully', 'deleteHome', existingHome)
	} catch (error) {
		return Result.internalServerError('Failed to delete home entry', 'deleteHome', error as Error)
	}
}

export const forceDeleteHome: ForceDeleteHome = async args => {
	const { where } = args

	try {
		const authenticated = await verifySession('forceDeleteHome')

		if (authenticated.error) return authenticated

		logger.info('Force deleting home entry', 'forceDeleteHome', { where })

		const existingHome = await prisma.home.findFirst({ where })

		if (!existingHome) return Result.notFound('Home entry not found', 'forceDeleteHome')

		await prisma.home.delete({ where })

		return Result.success('Home entry force deleted successfully', 'forceDeleteHome', existingHome)
	} catch (error) {
		return Result.internalServerError(
			'Failed to force delete home entry',
			'forceDeleteHome',
			error as Error,
		)
	}
}
