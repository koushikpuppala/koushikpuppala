import { Transform } from 'class-transformer'
import { UserRole, UserStatus } from '@repo/prisma'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

export class QueryUserDto {
	@ApiPropertyOptional({ type: 'integer', default: 1 })
	@Transform(({ value }) => Number(value))
	@IsOptional()
	@IsInt()
	@Min(1)
	page = 1

	@ApiPropertyOptional({ type: 'integer', default: 10 })
	@Transform(({ value }) => Number(value))
	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(100)
	limit = 10

	@ApiPropertyOptional({ description: 'Search by name or email' })
	@IsOptional()
	@IsString()
	search?: string

	@ApiPropertyOptional({ enum: UserRole })
	@Transform(({ value }) => (typeof value === 'string' ? (value.toUpperCase() as UserRole) : value))
	@IsOptional()
	@IsEnum(UserRole)
	role?: UserRole

	@ApiPropertyOptional({ enum: UserStatus })
	@IsOptional()
	@IsEnum(UserStatus)
	status?: UserStatus

	@ApiPropertyOptional({ enum: ['displayName', 'email', 'createdAt'] })
	@IsOptional()
	@IsIn(['displayName', 'email', 'createdAt'])
	sortBy: 'displayName' | 'email' | 'createdAt' = 'createdAt'

	@ApiPropertyOptional({ enum: ['asc', 'desc'] })
	@IsOptional()
	@IsIn(['asc', 'desc'])
	sortOrder: 'asc' | 'desc' = 'desc'
}
