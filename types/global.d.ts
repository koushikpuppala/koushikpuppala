// types/global.d.ts

import { PrismaClient } from '@prisma/index'
import { withAccelerate } from '@prisma/extension-accelerate'

const prismaClient = new PrismaClient().$extends(withAccelerate())

declare global {
	var prismaGlobal: typeof prismaClient | undefined
}

export {}
