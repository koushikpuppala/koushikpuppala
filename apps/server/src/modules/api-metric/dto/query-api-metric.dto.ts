import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsDateString, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

export class QueryApiMetricDto {
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
	limit = 20

	@ApiPropertyOptional()
	@Transform(({ value }) => (value ? Number(value) : undefined))
	@IsOptional()
	@IsInt()
	status?: number

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	method?: string

	@ApiPropertyOptional()
	@IsOptional()
	@IsDateString()
	from?: string

	@ApiPropertyOptional()
	@IsOptional()
	@IsDateString()
	to?: string
}
