import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsOptional, Max, Min } from 'class-validator'

export class PaginationDto {
	@ApiPropertyOptional({ default: 1 })
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@IsOptional()
	page = 1

	@ApiPropertyOptional({ default: 10 })
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(100)
	@IsOptional()
	limit = 10
}
