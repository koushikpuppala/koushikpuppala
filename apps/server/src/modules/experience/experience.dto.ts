import { PublishFilterDto, PublishableDto } from 'common/dto/publishable.dto'
import {
	IsArray,
	IsBoolean,
	IsDateString,
	IsEnum,
	IsIn,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
	IsUrl,
} from 'class-validator'
import { EmploymentType } from '@repo/prisma'
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { ToBoolean } from 'common/decorators/to-boolean.decorator'

export class CreateExperienceDto extends PublishableDto {
	@ApiProperty({ example: 'Software Engineer' })
	@IsString()
	@IsNotEmpty()
	title!: string

	@ApiProperty({ example: 'Upraised®' })
	@IsString()
	@IsNotEmpty()
	organization!: string

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
	isCurrent?: boolean

	@ApiPropertyOptional({ example: false, default: false })
	@IsBoolean()
	@IsOptional()
	featured?: boolean

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
	achievements?: string[]

	@ApiPropertyOptional({
		example: ['TypeScript', 'NestJS', 'React', 'PostgreSQL', 'Docker'],
		type: [String],
	})
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	technologies?: string[]

	@ApiPropertyOptional({ example: 'https://upraised.co' })
	@IsUrl()
	@IsOptional()
	website?: string

	@ApiPropertyOptional({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
	@IsUUID()
	@IsOptional()
	logoId?: string
}

export class UpdateExperienceDto extends PartialType(CreateExperienceDto) {}

const EXPERIENCE_SORT_FIELDS = [
	'title',
	'organization',
	'startDate',
	'isPublished',
	'sortOrder',
	'createdAt',
] as const

export class QueryExperienceDto extends PublishFilterDto {
	@ApiPropertyOptional({ enum: [...EXPERIENCE_SORT_FIELDS] })
	@IsIn(EXPERIENCE_SORT_FIELDS)
	@IsOptional()
	sortBy?: (typeof EXPERIENCE_SORT_FIELDS)[number]

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	search?: string

	@ApiPropertyOptional({ enum: EmploymentType })
	@IsEnum(EmploymentType)
	@IsOptional()
	employmentType?: EmploymentType

	@ApiPropertyOptional()
	@ToBoolean()
	@IsBoolean()
	@IsOptional()
	featured?: boolean
}
