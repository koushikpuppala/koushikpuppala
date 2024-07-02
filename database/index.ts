export * from './models'

import { Connection, connect, connection, set } from 'mongoose'

export class Database {
	private static _instance: Database
	private _client: Connection

	private constructor() {
		set('strictQuery', true)
		this._client = connection
	}

	public static get instance(): Database {
		return this._instance || (this._instance = new this())
	}

	public get client(): Connection {
		return this._client
	}

	public async connect(): Promise<void> {
		await connect(process.env.MONGO_URI!, {
			connectTimeoutMS: 10000,
			socketTimeoutMS: 45000,
			serverSelectionTimeoutMS: 5000,
			family: 4,
			maxPoolSize: 100,
			minPoolSize: 10,
			dbName: process.env.DATABASE!,
		})
		this._client = connection
		this._client.on('error', console.error.bind(console, 'connection error:'))
		this._client.once('open', () => {
			process.env.NODE_ENV === 'development' && console.log('Connected to MongoDB')
		})
	}

	public async disconnect(): Promise<void> {
		await connection.close()
		this._client.once('disconnected', () => {
			process.env.NODE_ENV === 'development' && console.log('Disconnected from MongoDB')
		})
	}
}
