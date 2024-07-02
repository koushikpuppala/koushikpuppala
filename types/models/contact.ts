import { Document } from 'mongoose'

export type ContactModalProps = Document<string> & {
	_id: string
	name: string
	email: string
	subject: string
	message: string
	createdAt: Date
}
