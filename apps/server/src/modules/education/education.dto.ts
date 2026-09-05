import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import {
	IsArray,
	IsBoolean,
	IsDateString,
	IsInt,
	IsOptional,
	IsString,
	IsUrl,
	IsUUID,
} from 'class-validator'
import { Type } from 'class-transformer'
import { PaginationDto } from 'common/dto/pagination.dto'

export class CreateEducationDto {
	@ApiProperty({ example: 'Bachelor of Technology (B.Tech)' })
	@IsString()
	degree!: string

	@ApiProperty({ example: 'Computer Science and Engineering' })
	@IsString()
	fieldOfStudy!: string

	@ApiProperty({ example: 'Indian Institute of Information Technology Raichur' })
	@IsString()
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
	achievements?: string[] = []

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
	isCurrent?: boolean = false

	@ApiPropertyOptional({ example: 'https://iiitr.ac.in' })
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

export class UpdateEducationDto extends PartialType(CreateEducationDto) {}

export class QueryEducationDto extends PaginationDto {
	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	search?: string

	@ApiPropertyOptional()
	@Type(() => Boolean)
	@IsBoolean()
	@IsOptional()
	isPublished?: boolean
}
