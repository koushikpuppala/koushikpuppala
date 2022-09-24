import mongoose from 'mongoose'

export type DatabaseType = {
	connect: () => Promise<typeof mongoose>
	disconnect: () => Promise<void>
}
