import { SortableDto } from 'common/dto/publishable.dto'
import { SocialPlatform } from '@repo/prisma'
import { SortablePaginationDto } from 'common/dto/pagination.dto'
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { IsBoolean, IsEnum, IsOptional, IsString, Matches, IsIn } from 'class-validator'
import { ToBoolean } from 'common/decorators/to-boolean.decorator'

export class CreateSocialDto extends SortableDto {
	@ApiProperty({ enum: SocialPlatform, example: SocialPlatform.GITHUB })
	@IsEnum(SocialPlatform)
	platform!: SocialPlatform

	@ApiProperty({ example: 'https://github.com/koushikpuppala' })
	@Matches(/^(https?:\/\/\S+|mailto:[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+)$/, {
		message: 'url must be an http(s) URL or a mailto: address',
	})
	url!: string

	@ApiPropertyOptional({ example: 'GitHub' })
	@IsString()
	@IsOptional()
	label?: string

	@ApiPropertyOptional({
		example: '@koushikpuppala',
		description: 'Social platform handle / username',
	})
	@IsString()
	@IsOptional()
	handle?: string

	@ApiPropertyOptional({ example: 'si:github' })
	@IsString()
	@IsOptional()
	icon?: string

	@ApiPropertyOptional({ example: true, default: false })
	@IsBoolean()
	@IsOptional()
	featured?: boolean

	@ApiPropertyOptional({ example: true, default: true })
	@IsBoolean()
	@IsOptional()
	isVisible?: boolean
}

export class UpdateSocialDto extends PartialType(CreateSocialDto) {}

const SOCIAL_SORT_FIELDS = [
	'platform',
	'label',
	'url',
	'isVisible',
	'sortOrder',
	'createdAt',
] as const

export class QuerySocialDto extends SortablePaginationDto {
	@ApiPropertyOptional({ enum: [...SOCIAL_SORT_FIELDS] })
	@IsIn(SOCIAL_SORT_FIELDS)
	@IsOptional()
	sortBy?: (typeof SOCIAL_SORT_FIELDS)[number]

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	search?: string

	@ApiPropertyOptional({ enum: SocialPlatform })
	@IsEnum(SocialPlatform)
	@IsOptional()
	platform?: SocialPlatform

	@ApiPropertyOptional()
	@ToBoolean()
	@IsBoolean()
	@IsOptional()
	featured?: boolean

	@ApiPropertyOptional()
	@ToBoolean()
	@IsBoolean()
	@IsOptional()
	isVisible?: boolean
}
