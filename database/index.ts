export * from './models'

import mongoose from 'mongoose'

export class Database {
	private static _instance: Database
	private _connection: mongoose.Connection

	private constructor() {
		mongoose.set('strictQuery', true)
		mongoose.connect(process.env.MONGO_URI!, {
			connectTimeoutMS: 10000,
			socketTimeoutMS: 45000,
			serverSelectionTimeoutMS: 5000,
			family: 4,
			maxPoolSize: 100,
			minPoolSize: 10,
		})
		this._connection = mongoose.connection
		this._connection.on('error', console.error.bind(console, 'connection error:'))
		this._connection.once('open', () => {
			process.env.NODE_ENV === 'development' && console.log('Connected to MongoDB')
		})
		this._connection.once('disconnected', () => {
			process.env.NODE_ENV === 'development' && console.log('Disconnected from MongoDB')
		})
	}

	public static get instance(): Database {
		if (!Database._instance) {
			Database._instance = new Database()
		}
		return Database._instance
	}

	public get connection(): mongoose.Connection {
		return this._connection
	}
}
