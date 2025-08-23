import type { ServerActionResponse } from 'types/lib'
import type { Metadata, MetadataType, Prisma } from 'prisma'

export type GetMetadata = (args: {
	key: string
	type?: MetadataType
}) => Promise<ServerActionResponse<Pick<Metadata, 'title' | 'description' | 'keywords'>>>

export type GetAllMetadata = (args: {
	page?: number
	count?: number
	nonPaginated?: boolean
	where?: Prisma.MetadataWhereInput
	orderBy?: Prisma.MetadataOrderByWithRelationInput
	select?: Prisma.MetadataSelect
}) => Promise<ServerActionResponse<Metadata[]>>

export type CreateMetadata = (args: {
	data: Prisma.MetadataCreateInput
}) => Promise<ServerActionResponse<Metadata>>

export type UpdateMetadata = (args: {
	where: Prisma.MetadataWhereUniqueInput
	data: Prisma.MetadataUpdateInput
}) => Promise<ServerActionResponse<Metadata>>

export type DeleteMetadata = (args: {
	where: Prisma.MetadataWhereUniqueInput
}) => Promise<ServerActionResponse<Metadata>>

export type ForceDeleteMetadata = (args: {
	where: Prisma.MetadataWhereUniqueInput
}) => Promise<ServerActionResponse<Metadata>>
