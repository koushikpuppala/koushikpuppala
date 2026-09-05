import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import {
	IsArray,
	IsBoolean,
	IsInt,
	IsObject,
	IsOptional,
	IsString,
	IsUUID,
} from 'class-validator'
import { Type } from 'class-transformer'
import { PaginationDto } from 'common/dto/pagination.dto'

export class CreateHomeDto {
	@ApiProperty({ example: 'Koushik Puppala' })
	@IsString()
	title!: string

	@ApiPropertyOptional({ example: '|', default: '|' })
	@IsString()
	@IsOptional()
	separator?: string = '|'

	@ApiProperty({
		example: ['Software Engineer', 'Full Stack Developer', 'Open Source Contributor'],
		type: [String],
	})
	@IsArray()
	@IsString({ each: true })
	subtitles!: string[]

	@ApiProperty({
		example: 'Passionate software engineer focused on building scalable, reliable full-stack applications.',
	})
	@IsString()
	content!: string

	@ApiPropertyOptional({ example: 'View Projects', default: 'View Projects' })
	@IsString()
	@IsOptional()
	ctaLabel?: string = 'View Projects'

	@ApiPropertyOptional({ example: '/projects', default: '/projects' })
	@IsString()
	@IsOptional()
	ctaUrl?: string = '/projects'

	@ApiPropertyOptional({ example: 'Contact Me' })
	@IsString()
	@IsOptional()
	secondaryCtaLabel?: string

	@ApiPropertyOptional({ example: '/contact' })
	@IsString()
	@IsOptional()
	secondaryCtaUrl?: string

	@ApiPropertyOptional({
		example: { yearsExperience: 4, projectsCompleted: 25, contributions: 1200 },
	})
	@IsObject()
	@IsOptional()
	stats?: Record<string, unknown>

	@ApiPropertyOptional({
		example: ['TypeScript', 'Next.js', 'NestJS', 'PostgreSQL'],
		type: [String],
	})
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	featuredSkills?: string[] = []

	@ApiPropertyOptional({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
	@IsUUID()
	@IsOptional()
	profileImageId?: string

	@ApiPropertyOptional({ example: 0, default: 0 })
	@IsInt()
	@IsOptional()
	sortOrder?: number = 0

	@ApiPropertyOptional({ example: true, default: false })
	@IsBoolean()
	@IsOptional()
	isPublished?: boolean = false
}

export class UpdateHomeDto extends PartialType(CreateHomeDto) {}

export class QueryHomeDto extends PaginationDto {
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
