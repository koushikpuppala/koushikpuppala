import type { UserRole, UserStatus } from '../enums/index'

export type UserRecord = {
	id: string
	email: string
	name: string
	role: UserRole
	status: UserStatus
	createdAt: Date | string
}

export type CreateUserPayload = {
	fullName: string
	email: string
	password: string
	role: UserRole
	status: UserStatus
}

export type UpdateUserPayload = {
	role: UserRole
	status: UserStatus
}
