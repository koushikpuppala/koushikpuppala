import mongoose from 'mongoose'
import { config } from 'config'
import { DatabaseType } from 'types/database'

export const Database: DatabaseType = {
	connect: (): Promise<typeof mongoose> =>
		mongoose.connect(config.mongoDB.uri, {
			autoIndex: false,
			connectTimeoutMS: 10000,
			family: 4,
			maxPoolSize: 10,
			serverSelectionTimeoutMS: 5000,
			socketTimeoutMS: 45000,
		}),
	disconnect: (): Promise<void> => mongoose.disconnect(),
}
