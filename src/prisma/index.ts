import { PrismaClient } from './generated/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const prismaClientSingleton = () =>
	new PrismaClient({ errorFormat: 'pretty' }).$extends(withAccelerate())

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

export * from './generated/client'
