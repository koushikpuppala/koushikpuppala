import type { About, Prisma } from 'prisma'
import type { ServerActionResponse } from 'types/lib'

export type GetAbout = () => Promise<ServerActionResponse<Pick<About, 'title' | 'introduction'>>>

export type GetAllAbout = (args: {
	page?: number
	count?: number
	nonPaginated?: boolean
	where?: Prisma.AboutWhereInput
	orderBy?: Prisma.AboutOrderByWithRelationInput
	select?: Prisma.AboutSelect
}) => Promise<ServerActionResponse<About[]>>

export type CreateAbout = (args: {
	data: Prisma.AboutCreateInput
}) => Promise<ServerActionResponse<About>>

export type UpdateAbout = (args: {
	where: Prisma.AboutWhereUniqueInput
	data: Prisma.AboutUpdateInput
}) => Promise<ServerActionResponse<About>>

export type DeleteAbout = (args: {
	where: Prisma.AboutWhereUniqueInput
}) => Promise<ServerActionResponse<About>>

export type ForceDeleteAbout = (args: {
	where: Prisma.AboutWhereUniqueInput
}) => Promise<ServerActionResponse<About>>
