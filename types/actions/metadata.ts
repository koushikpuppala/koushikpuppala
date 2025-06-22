import { Metadata, MetadataType, Prisma } from '@import/prisma'
import { ServerActionResponse } from './index'

export type GetMetadataArgs = (args: {
	key: string
	type?: MetadataType
}) => Promise<ServerActionResponse<Pick<Metadata, 'title' | 'description' | 'keywords'>>>

export type GetAllMetadataArgs = (args: {
	page?: number
	count?: number
	nonPaginated?: boolean
	where?: Prisma.MetadataWhereInput
	orderBy?: Prisma.MetadataOrderByWithRelationInput
	select?: Prisma.MetadataSelect
}) => Promise<ServerActionResponse<Metadata[]>>

export type CreateMetadataArgs = (args: {
	data: Prisma.MetadataCreateInput
}) => Promise<ServerActionResponse<Metadata>>

export type UpdateMetadataArgs = (args: {
	where: Prisma.MetadataWhereUniqueInput
	data: Prisma.MetadataUpdateInput
}) => Promise<ServerActionResponse<Metadata>>

export type DeleteMetadataArgs = (args: {
	where: Prisma.MetadataWhereUniqueInput
}) => Promise<ServerActionResponse<Metadata>>

export type ForceDeleteMetadataArgs = (args: {
	where: Prisma.MetadataWhereUniqueInput
}) => Promise<ServerActionResponse<Metadata>>
