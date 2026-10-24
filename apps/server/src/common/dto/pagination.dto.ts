import type { SortOrder } from 'types/api'

import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator'

const SORT_ORDERS = ['asc', 'desc'] as const satisfies readonly SortOrder[]

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

export class SortablePaginationDto extends PaginationDto {
	@ApiPropertyOptional({ enum: SORT_ORDERS })
	@IsIn(SORT_ORDERS)
	@IsOptional()
	sortOrder?: SortOrder
}
