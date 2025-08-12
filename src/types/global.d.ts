// types/global.d.ts

import { PrismaClient } from 'prisma'
import { withAccelerate } from '@prisma/extension-accelerate'

// eslint-disable-next-line
const prismaClient = new PrismaClient().$extends(withAccelerate())

declare global {
	var prismaGlobal: typeof prismaClient | undefined
}

export {}
