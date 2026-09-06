import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { UserRole, UserStatus } from '@repo/prisma'
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'

export class UserResponseDto {
	@ApiProperty({ example: 'usr_01J123ABCDEF' })
	id!: string

	@ApiProperty({ example: 'john@example.com' })
	email!: string

	@ApiProperty({ example: 'John Doe' })
	name!: string

	@ApiProperty({ example: 'ADMIN' })
	role!: string
}

export class AdminCreateUserDto {
	@ApiProperty({ example: 'John Manager' })
	@IsString()
	@IsNotEmpty()
	fullName!: string

	@ApiProperty({ example: 'manager@factory.com' })
	@IsEmail()
	@IsNotEmpty()
	email!: string

	@ApiProperty({ example: '+1234567890', required: false })
	@IsString()
	@IsOptional()
	phoneNumber?: string

	@ApiProperty({ enum: UserRole, example: 'ADMIN' })
	@Transform(({ value }) => (typeof value === 'string' ? (value.toUpperCase() as UserRole) : value))
	@IsEnum(UserRole)
	@IsNotEmpty()
	role!: UserRole

	@ApiProperty({ example: 'password123' })
	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	password!: string

	@ApiProperty({ example: 'password123', required: false })
	@IsString()
	@IsOptional()
	confirmPassword?: string

	@ApiProperty({ enum: UserStatus, example: 'ACTIVE', required: false })
	@IsEnum(UserStatus)
	@IsOptional()
	status?: UserStatus
}

export class AdminUpdateUserDto {
	@ApiProperty({ example: 'John Updated Manager', required: false })
	@IsString()
	@IsOptional()
	fullName?: string

	@ApiProperty({ example: '+1234567890', required: false })
	@IsString()
	@IsOptional()
	phoneNumber?: string

	@ApiProperty({ enum: UserRole, example: 'ADMIN', required: false })
	@Transform(({ value }) => (typeof value === 'string' ? (value.toUpperCase() as UserRole) : value))
	@IsEnum(UserRole)
	@IsOptional()
	role?: UserRole

	@ApiProperty({ enum: UserStatus, example: 'ACTIVE', required: false })
	@IsEnum(UserStatus)
	@IsOptional()
	status?: UserStatus

	@ApiProperty({ example: 'newpassword123', required: false })
	@IsString()
	@IsOptional()
	@MinLength(6)
	password?: string
}
