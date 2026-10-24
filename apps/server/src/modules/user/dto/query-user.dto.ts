import { Transform } from 'class-transformer'
import { UserRole, UserStatus } from '@repo/prisma'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsDateString, IsEnum, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

const USER_SORT_FIELDS = ['displayName', 'email', 'role', 'status', 'createdAt'] as const

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

	@ApiPropertyOptional({ example: '2026-01-01', description: 'Joined on or after this date' })
	@IsOptional()
	@IsDateString()
	from?: string

	@ApiPropertyOptional({ example: '2026-01-31', description: 'Joined on or before this date' })
	@IsOptional()
	@IsDateString()
	to?: string

	@ApiPropertyOptional({ enum: [...USER_SORT_FIELDS] })
	@IsOptional()
	@IsIn(USER_SORT_FIELDS)
	sortBy: (typeof USER_SORT_FIELDS)[number] = 'createdAt'

	@ApiPropertyOptional({ enum: ['asc', 'desc'] })
	@IsOptional()
	@IsIn(['asc', 'desc'])
	sortOrder: 'asc' | 'desc' = 'desc'
}
