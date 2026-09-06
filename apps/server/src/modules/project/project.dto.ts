import {
	IsArray,
	IsBoolean,
	IsDateString,
	IsEnum,
	IsInt,
	IsObject,
	IsOptional,
	IsString,
	IsUrl,
	IsUUID,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ProjectStatus } from '@repo/prisma'
import { PaginationDto } from 'common/dto/pagination.dto'
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'

export class CreateProjectDto {
	@ApiProperty({ example: 'koushikpuppala-portfolio' })
	@IsString()
	slug!: string

	@ApiProperty({ example: 'Personal Portfolio & CMS' })
	@IsString()
	title!: string

	@ApiProperty({ example: 'Full-stack monorepo with Next.js 16 and NestJS' })
	@IsString()
	subtitle!: string

	@ApiProperty({ example: 'Full Stack' })
	@IsString()
	category!: string

	@ApiPropertyOptional({ example: 'Web Application' })
	@IsString()
	@IsOptional()
	projectType?: string

	@ApiPropertyOptional({ example: true, default: false })
	@IsBoolean()
	@IsOptional()
	featured?: boolean = false

	@ApiPropertyOptional({ enum: ProjectStatus, default: ProjectStatus.COMPLETED })
	@IsEnum(ProjectStatus)
	@IsOptional()
	status?: ProjectStatus = ProjectStatus.COMPLETED

	@ApiPropertyOptional({ example: 'A production-grade portfolio and administrative CMS platform.' })
	@IsString()
	@IsOptional()
	shortDescription?: string

	@ApiProperty({
		example: [
			'Designed with pnpm workspaces, Turborepo, Next.js 16, and NestJS 11.',
			'Features PostgreSQL via Prisma 7, AWS S3 media uploads, and Firebase Auth.',
		],
		type: [String],
	})
	@IsArray()
	@IsString({ each: true })
	descriptions!: string[]

	@ApiPropertyOptional({
		example:
			'Comprehensive case study detailing architecture decisions, CI/CD pipeline, and caching strategy.',
	})
	@IsString()
	@IsOptional()
	caseStudy?: string

	@ApiPropertyOptional({
		example: ['Next.js', 'NestJS', 'PostgreSQL', 'AWS S3', 'Redis'],
		type: [String],
	})
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	tags?: string[] = []

	@ApiPropertyOptional({
		example: ['TypeScript', 'Tailwind CSS', 'Docker', 'Prisma'],
		type: [String],
	})
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	technologies?: string[] = []

	@ApiPropertyOptional({ example: { lighthouseScore: 98, stars: 150 } })
	@IsObject()
	@IsOptional()
	metrics?: Record<string, unknown>

	@ApiPropertyOptional({ example: '2024-01-01T00:00:00.000Z' })
	@IsDateString()
	@IsOptional()
	startDate?: string

	@ApiPropertyOptional({ example: '2024-06-01T00:00:00.000Z' })
	@IsDateString()
	@IsOptional()
	endDate?: string

	@ApiPropertyOptional({ example: 'https://github.com/koushikpuppala/koushikpuppala' })
	@IsUrl()
	@IsOptional()
	github?: string

	@ApiPropertyOptional({ example: 'https://koushikpuppala.com' })
	@IsUrl()
	@IsOptional()
	liveUrl?: string

	@ApiPropertyOptional({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
	@IsUUID()
	@IsOptional()
	thumbnailId?: string

	@ApiPropertyOptional({ example: 'b1ffcd88-8b1c-4fe9-aa7e-7cc8ae491b22' })
	@IsUUID()
	@IsOptional()
	heroImageId?: string

	@ApiPropertyOptional({ example: 0, default: 0 })
	@IsInt()
	@IsOptional()
	sortOrder?: number = 0

	@ApiPropertyOptional({ example: true, default: false })
	@IsBoolean()
	@IsOptional()
	isPublished?: boolean = false
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}

export class QueryProjectDto extends PaginationDto {
	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	search?: string

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	category?: string

	@ApiPropertyOptional({ enum: ProjectStatus })
	@IsEnum(ProjectStatus)
	@IsOptional()
	status?: ProjectStatus

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

export class AddGalleryMediaDto {
	@ApiProperty({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
	@IsUUID()
	mediaId!: string

	@ApiPropertyOptional({ example: 'Dashboard Overview' })
	@IsString()
	@IsOptional()
	title?: string

	@ApiPropertyOptional({ example: 'Screenshot of the admin CMS analytics dashboard' })
	@IsString()
	@IsOptional()
	description?: string

	@ApiPropertyOptional({ example: 'CMS Dashboard in Dark Mode' })
	@IsString()
	@IsOptional()
	caption?: string

	@ApiPropertyOptional({ example: 'Admin dashboard showing traffic graphs and recent updates' })
	@IsString()
	@IsOptional()
	altText?: string

	@ApiPropertyOptional({ example: false, default: false })
	@IsBoolean()
	@IsOptional()
	isFeatured?: boolean = false

	@ApiPropertyOptional({ example: true, default: true })
	@IsBoolean()
	@IsOptional()
	isVisible?: boolean = true

	@ApiPropertyOptional({ example: 0, default: 0 })
	@IsInt()
	@IsOptional()
	sortOrder?: number = 0
}

export class UpdateGalleryMediaDto extends PartialType(AddGalleryMediaDto) {}
