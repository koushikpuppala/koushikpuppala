import { Document } from 'mongoose'

export interface ContactModalProps extends Document {
	name: string
	email: string
	subject: string
	message: string
	url: string
	createdAt: Date
	updatedAt: Date
}
