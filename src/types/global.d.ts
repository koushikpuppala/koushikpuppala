import { PrismaClient } from 'prisma'
import { withAccelerate } from '@prisma/extension-accelerate'

// eslint-disable-next-line
const _client = new PrismaClient().$extends(withAccelerate())

declare global {
	var prismaGlobal: typeof _client | undefined
}

export {}
