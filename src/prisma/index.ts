import { PrismaClient } from './client/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const prismaClientSingleton = () => new PrismaClient().$extends(withAccelerate())

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

export * from './client/client'
