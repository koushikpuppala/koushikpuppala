import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import {
	IsBoolean,
	IsEnum,
	IsInt,
	IsOptional,
	IsString,
	IsUrl,
} from 'class-validator'
import { Type } from 'class-transformer'
import { SocialPlatform } from '@repo/prisma'
import { PaginationDto } from 'common/dto/pagination.dto'

export class CreateSocialDto {
	@ApiProperty({ enum: SocialPlatform, example: SocialPlatform.GITHUB })
	@IsEnum(SocialPlatform)
	platform!: SocialPlatform

	@ApiProperty({ example: 'https://github.com/koushikpuppala' })
	@IsUrl()
	url!: string

	@ApiPropertyOptional({ example: 'GitHub' })
	@IsString()
	@IsOptional()
	label?: string

	@ApiPropertyOptional({ example: 'si:github' })
	@IsString()
	@IsOptional()
	icon?: string

	@ApiPropertyOptional({ example: true, default: false })
	@IsBoolean()
	@IsOptional()
	featured?: boolean = false

	@ApiPropertyOptional({ example: true, default: true })
	@IsBoolean()
	@IsOptional()
	isVisible?: boolean = true

	@ApiPropertyOptional({ example: 0, default: 0 })
	@IsInt()
	@IsOptional()
	sortOrder?: number = 0
}

export class UpdateSocialDto extends PartialType(CreateSocialDto) {}

export class QuerySocialDto extends PaginationDto {
	@ApiPropertyOptional({ enum: SocialPlatform })
	@IsEnum(SocialPlatform)
	@IsOptional()
	platform?: SocialPlatform

	@ApiPropertyOptional()
	@Type(() => Boolean)
	@IsBoolean()
	@IsOptional()
	featured?: boolean

	@ApiPropertyOptional()
	@Type(() => Boolean)
	@IsBoolean()
	@IsOptional()
	isVisible?: boolean
}
