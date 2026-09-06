import { AuditAction } from '@repo/prisma'
import { Transform } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsDateString, IsEnum, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

export class QueryAuditLogDto {
	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	search?: string

	@ApiPropertyOptional()
	@Transform(({ value }) => Number(value))
	@IsOptional()
	@IsInt()
	@Min(1)
	page = 1

	@ApiPropertyOptional()
	@Transform(({ value }) => Number(value))
	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(100)
	limit = 10

	@ApiPropertyOptional({ enum: AuditAction })
	@IsOptional()
	@IsEnum(AuditAction)
	action?: AuditAction

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	entity?: string

	@ApiPropertyOptional()
	@IsOptional()
	@IsDateString()
	from?: string

	@ApiPropertyOptional()
	@IsOptional()
	@IsDateString()
	to?: string

	@ApiPropertyOptional({ enum: ['createdAt'] })
	@IsOptional()
	@IsIn(['createdAt'])
	sortBy: 'createdAt' = 'createdAt'

	@ApiPropertyOptional({ enum: ['asc', 'desc'] })
	@IsOptional()
	@IsIn(['asc', 'desc'])
	sortOrder: 'asc' | 'desc' = 'desc'
}
