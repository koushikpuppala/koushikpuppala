'use server'

import type {
	CreateMetadataArgs,
	DeleteMetadataArgs,
	ForceDeleteMetadataArgs,
	UpdateMetadataArgs,
} from 'types/actions'

import { verifySession } from 'lib/session'
import { logger } from 'lib/logger'
import { Result } from 'lib/result'
import { prisma } from 'prisma'

export const createMetadata: CreateMetadataArgs = async args => {
	const { data } = args

	try {
		const authenticated = await verifySession('createMetadata')

		if (authenticated.error) return authenticated

		logger.info('Creating metadata', 'createMetadata', { data })

		const existingMetadata = await prisma.metadata.findUnique({
			where: { key: data.key, type: data.type, deletedAt: null },
		})

		if (existingMetadata)
			return Result.conflict('Metadata with the same key and type already exists', 'createMetadata')

		const newMetadata = await prisma.metadata.create({ data })

		return Result.created('Metadata created successfully', 'createMetadata', newMetadata)
	} catch (error) {
		return Result.internalServerError('Failed to create metadata', 'createMetadata', error as Error)
	}
}

export const updateMetadata: UpdateMetadataArgs = async args => {
	const { where, data } = args

	try {
		const authenticated = await verifySession('updateMetadata')

		if (authenticated.error) return authenticated

		logger.info('Updating metadata', 'updateMetadata', { where, data })

		const existingMetadata = await prisma.metadata.findUnique({
			where: { ...where, deletedAt: null },
		})

		if (!existingMetadata) return Result.notFound('Metadata not found', 'updateMetadata')

		const updatedMetadata = await prisma.metadata.update({
			where: { ...where, deletedAt: null },
			data: { ...data, version: { increment: 0.1 } },
		})

		return Result.success('Metadata updated successfully', 'updateMetadata', updatedMetadata)
	} catch (error) {
		return Result.internalServerError('Failed to update metadata', 'updateMetadata', error as Error)
	}
}

export const deleteMetadata: DeleteMetadataArgs = async args => {
	const { where } = args

	try {
		const authenticated = await verifySession('deleteMetadata')

		if (authenticated.error) return authenticated

		logger.info('Deleting metadata', 'deleteMetadata', { where })

		const existingMetadata = await prisma.metadata.findUnique({
			where: { ...where, deletedAt: null },
		})

		if (!existingMetadata) return Result.notFound('Metadata not found', 'deleteMetadata')

		await prisma.metadata.update({
			where: { ...where, deletedAt: null },
			data: { deletedAt: new Date() },
		})

		return Result.noContent('Metadata deleted successfully', 'deleteMetadata')
	} catch (error) {
		return Result.internalServerError('Failed to delete metadata', 'deleteMetadata', error as Error)
	}
}

export const forceDeleteMetadata: ForceDeleteMetadataArgs = async args => {
	const { where } = args

	try {
		const authenticated = await verifySession('forceDeleteMetadata')

		if (authenticated.error) return authenticated

		logger.info('Force deleting metadata', 'forceDeleteMetadata', { where })

		const existingMetadata = await prisma.metadata.findUnique({ where })

		if (!existingMetadata) return Result.notFound('Metadata not found', 'forceDeleteMetadata')

		await prisma.metadata.delete({ where })

		return Result.noContent('Metadata force deleted successfully', 'forceDeleteMetadata')
	} catch (error) {
		return Result.internalServerError(
			'Failed to force delete metadata',
			'forceDeleteMetadata',
			error as Error,
		)
	}
}
