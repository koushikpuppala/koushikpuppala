import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger'
import { IsBoolean, IsInt, IsOptional } from 'class-validator'
import { ToBoolean } from 'common/decorators/to-boolean.decorator'
import type { Type } from '@nestjs/common'
import { PaginationDto, SortablePaginationDto } from './pagination.dto'

export class SortableDto {
	@ApiPropertyOptional({ example: 0, default: 0 })
	@IsInt()
	@IsOptional()
	sortOrder?: number
}

export class PublishFlagDto {
	@ApiPropertyOptional({ example: true, default: false })
	@IsBoolean()
	@IsOptional()
	isPublished?: boolean
}

export class PublishableDto extends IntersectionType(SortableDto, PublishFlagDto) {}

const withPublishFilter = <T extends Type<object>>(Base: T) => {
	class PublishFiltered extends Base {
		@ApiPropertyOptional()
		@ToBoolean()
		@IsBoolean()
		@IsOptional()
		isPublished?: boolean
	}

	return PublishFiltered
}

export class PublishFilterDto extends withPublishFilter(SortablePaginationDto) {}

export class PublishPageDto extends withPublishFilter(PaginationDto) {}
