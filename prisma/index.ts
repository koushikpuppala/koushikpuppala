import { PrismaClient } from '@prisma/index'
import { withAccelerate } from '@prisma/extension-accelerate'

const prismaClientSingleton = () => new PrismaClient().$extends(withAccelerate())

declare const globalThis: { prismaGlobal: ReturnType<typeof prismaClientSingleton> } & typeof global

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

export * from '@prisma/index'
