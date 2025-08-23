'use server'

import type { CreateAbout, DeleteAbout, ForceDeleteAbout, UpdateAbout } from 'types/actions'

import { prisma } from 'prisma'
import { logger } from 'lib/logger'
import { Result } from 'lib/result'
import { verifySession } from 'lib/session'

export const createAbout: CreateAbout = async args => {
	const { data } = args

	try {
		const authenticated = await verifySession('createAbout')

		if (authenticated.error) return authenticated

		logger.info('Creating about information', 'createAbout', { data })

		const existingAbout = await prisma.about.findFirst({
			where: { deletedAt: null },
		})

		if (existingAbout) return Result.conflict('About information already exists', 'createAbout')

		const newAbout = await prisma.about.create({ data })

		return Result.success('About information created successfully', 'createAbout', newAbout)
	} catch (error) {
		return Result.internalServerError(
			'Failed to create about information',
			'createAbout',
			error as Error,
		)
	}
}

export const updateAbout: UpdateAbout = async args => {
	const { where, data } = args

	try {
		const authenticated = await verifySession('updateAbout')

		if (authenticated.error) return authenticated

		logger.info('Updating about information', 'updateAbout', { where, data })

		const existingAbout = await prisma.about.findFirst({
			where: { ...where, deletedAt: null },
		})

		if (!existingAbout) return Result.notFound('About information not found', 'updateAbout')

		const updatedAbout = await prisma.about.update({
			where: { ...where, deletedAt: null },
			data: { ...data, version: { increment: 0.1 } },
		})

		return Result.success('About information updated successfully', 'updateAbout', updatedAbout)
	} catch (error) {
		return Result.internalServerError(
			'Failed to update about information',
			'updateAbout',
			error as Error,
		)
	}
}

export const deleteAbout: DeleteAbout = async args => {
	const { where } = args

	try {
		const authenticated = await verifySession('deleteAbout')

		if (authenticated.error) return authenticated

		logger.info('Deleting about information', 'deleteAbout', { where })

		const existingAbout = await prisma.about.findFirst({
			where: { ...where, deletedAt: null },
		})

		if (!existingAbout) return Result.notFound('About information not found', 'deleteAbout')

		await prisma.about.update({
			where: { ...where, deletedAt: null },
			data: { deletedAt: new Date(), version: { increment: 0.1 } },
		})

		return Result.noContent('About information deleted successfully', 'deleteAbout')
	} catch (error) {
		return Result.internalServerError(
			'Failed to delete about information',
			'deleteAbout',
			error as Error,
		)
	}
}

export const forceDeleteAbout: ForceDeleteAbout = async args => {
	const { where } = args

	try {
		const authenticated = await verifySession('forceDeleteAbout')

		if (authenticated.error) return authenticated

		logger.info('Force deleting about information', 'forceDeleteAbout', { where })

		const existingAbout = await prisma.about.findFirst({ where })

		if (!existingAbout) return Result.notFound('About information not found', 'forceDeleteAbout')

		await prisma.about.delete({ where })

		return Result.noContent('About information force deleted successfully', 'forceDeleteAbout')
	} catch (error) {
		return Result.internalServerError(
			'Failed to force delete about information',
			'forceDeleteAbout',
			error as Error,
		)
	}
}
