import {
	IsArray,
	IsBoolean,
	IsDateString,
	IsEnum,
	IsInt,
	IsOptional,
	IsString,
	IsUrl,
	IsUUID,
} from 'class-validator'
import { Type } from 'class-transformer'
import { EmploymentType } from '@repo/prisma'
import { PaginationDto } from 'common/dto/pagination.dto'
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'

export class CreateExperienceDto {
	@ApiProperty({ example: 'Software Engineer' })
	@IsString()
	title!: string

	@ApiProperty({ example: 'Upraised®' })
	@IsString()
	company!: string

	@ApiProperty({ example: 'Bengaluru, Karnataka, India' })
	@IsString()
	location!: string

	@ApiProperty({ enum: EmploymentType, example: EmploymentType.FULL_TIME })
	@IsEnum(EmploymentType)
	employmentType!: EmploymentType

	@ApiProperty({ example: '2023-08-01T00:00:00.000Z' })
	@IsDateString()
	startDate!: string

	@ApiPropertyOptional({ example: '2024-06-01T00:00:00.000Z' })
	@IsDateString()
	@IsOptional()
	endDate?: string

	@ApiPropertyOptional({ example: true, default: false })
	@IsBoolean()
	@IsOptional()
	isCurrent?: boolean = false

	@ApiPropertyOptional({ example: false, default: false })
	@IsBoolean()
	@IsOptional()
	featured?: boolean = false

	@ApiProperty({
		example: [
			'Built high-performance full-stack web applications with Next.js and NestJS.',
			'Architected PostgreSQL schema and optimized query latency with Redis caching.',
		],
		type: [String],
	})
	@IsArray()
	@IsString({ each: true })
	description!: string[]

	@ApiPropertyOptional({
		example: ['Decreased page latency by 45%', 'Integrated automated CI/CD pipeline'],
		type: [String],
	})
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	achievements?: string[] = []

	@ApiPropertyOptional({
		example: ['TypeScript', 'NestJS', 'React', 'PostgreSQL', 'Docker'],
		type: [String],
	})
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	technologies?: string[] = []

	@ApiPropertyOptional({ example: 'https://upraised.co' })
	@IsUrl()
	@IsOptional()
	website?: string

	@ApiPropertyOptional({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
	@IsUUID()
	@IsOptional()
	logoId?: string

	@ApiPropertyOptional({ example: 0, default: 0 })
	@IsInt()
	@IsOptional()
	sortOrder?: number = 0

	@ApiPropertyOptional({ example: true, default: false })
	@IsBoolean()
	@IsOptional()
	isPublished?: boolean = false
}

export class UpdateExperienceDto extends PartialType(CreateExperienceDto) {}

export class QueryExperienceDto extends PaginationDto {
	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	search?: string

	@ApiPropertyOptional({ enum: EmploymentType })
	@IsEnum(EmploymentType)
	@IsOptional()
	employmentType?: EmploymentType

	@ApiPropertyOptional()
	@Type(() => Boolean)
	@IsBoolean()
	@IsOptional()
	featured?: boolean

	@ApiPropertyOptional()
	@Type(() => Boolean)
	@IsBoolean()
	@IsOptional()
	isPublished?: boolean
}
