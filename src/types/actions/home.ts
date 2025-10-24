import type { Home, Prisma } from 'prisma'
import type { ServerActionResponse } from 'types/lib'

export type GetHome = () => Promise<
	ServerActionResponse<Pick<Home, 'title' | 'subtitle' | 'separator' | 'content' | 'extension'>>
>

export type GetAllHome = (args: {
	page?: number
	count?: number
	nonPaginated?: boolean
	where?: Prisma.HomeWhereInput
	orderBy?: Prisma.HomeOrderByWithRelationInput
	select?: Prisma.HomeSelect
}) => Promise<ServerActionResponse<Home[]>>

export type CreateHome = (args: {
	data: Prisma.HomeCreateInput
}) => Promise<ServerActionResponse<Home>>

export type UpdateHome = (args: {
	where: Prisma.HomeWhereUniqueInput
	data: Prisma.HomeUpdateInput
}) => Promise<ServerActionResponse<Home>>

export type PublishHome = (args: {
	where: Prisma.HomeWhereUniqueInput
}) => Promise<ServerActionResponse<Home>>

export type DeleteHome = (args: {
	where: Prisma.HomeWhereUniqueInput
}) => Promise<ServerActionResponse<Home>>

export type ForceDeleteHome = (args: {
	where: Prisma.HomeWhereUniqueInput
}) => Promise<ServerActionResponse<Home>>
