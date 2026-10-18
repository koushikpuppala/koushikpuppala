import { PublishFilterDto, PublishableDto } from 'common/dto/publishable.dto'
import {
	IsArray,
	IsBoolean,
	IsDateString,
	IsIn,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
	IsUrl,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'

export class CreateEducationDto extends PublishableDto {
	@ApiProperty({ example: 'Bachelor of Technology (B.Tech)' })
	@IsString()
	@IsNotEmpty()
	degree!: string

	@ApiProperty({ example: 'Computer Science and Engineering' })
	@IsString()
	fieldOfStudy!: string

	@ApiProperty({ example: 'Indian Institute of Information Technology Raichur' })
	@IsString()
	@IsNotEmpty()
	university!: string

	@ApiProperty({ example: 'Raichur, Karnataka, India' })
	@IsString()
	location!: string

	@ApiProperty({
		example: [
			'Focused on Data Structures, Algorithms, Distributed Systems, and Database Management Systems.',
		],
		type: [String],
	})
	@IsArray()
	@IsString({ each: true })
	description!: string[]

	@ApiPropertyOptional({
		example: ['Lead at Google Developer Student Clubs (GDSC)', 'Head of College Website Team'],
		type: [String],
	})
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	achievements?: string[]

	@ApiPropertyOptional({
		example: ['Data Structures & Algorithms', 'Distributed Systems', 'Database Management'],
		type: [String],
	})
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	focusAreas?: string[]

	@ApiProperty({ example: '2021-08-01T00:00:00.000Z' })
	@IsDateString()
	startDate!: string

	@ApiPropertyOptional({ example: '2025-05-01T00:00:00.000Z' })
	@IsDateString()
	@IsOptional()
	endDate?: string

	@ApiPropertyOptional({ example: '2025-05-01T00:00:00.000Z' })
	@IsDateString()
	@IsOptional()
	expectedDate?: string

	@ApiPropertyOptional({ example: true, default: false })
	@IsBoolean()
	@IsOptional()
	isCurrent?: boolean

	@ApiPropertyOptional({ example: 'https://iiitr.ac.in' })
	@IsUrl()
	@IsOptional()
	website?: string

	@ApiPropertyOptional({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
	@IsUUID()
	@IsOptional()
	logoId?: string
}

export class UpdateEducationDto extends PartialType(CreateEducationDto) {}

const EDUCATION_SORT_FIELDS = [
	'degree',
	'university',
	'startDate',
	'isPublished',
	'sortOrder',
	'createdAt',
] as const

export class QueryEducationDto extends PublishFilterDto {
	@ApiPropertyOptional({ enum: [...EDUCATION_SORT_FIELDS] })
	@IsIn(EDUCATION_SORT_FIELDS)
	@IsOptional()
	sortBy?: (typeof EDUCATION_SORT_FIELDS)[number]

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	search?: string
}
