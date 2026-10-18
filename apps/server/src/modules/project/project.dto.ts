import { PublishFilterDto, PublishableDto, SortableDto } from 'common/dto/publishable.dto'
import {
	IsArray,
	IsBoolean,
	IsDateString,
	IsEnum,
	IsIn,
	IsNotEmpty,
	IsObject,
	IsOptional,
	IsString,
	IsUUID,
	IsUrl,
} from 'class-validator'
import { ProjectStatus } from '@repo/prisma'
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { ToBoolean } from 'common/decorators/to-boolean.decorator'

export class CreateProjectDto extends PublishableDto {
	@ApiProperty({ example: 'koushikpuppala-portfolio' })
	@IsString()
	@IsNotEmpty()
	slug!: string

	@ApiProperty({ example: 'Personal Portfolio & CMS' })
	@IsString()
	@IsNotEmpty()
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

	@ApiPropertyOptional({ example: 'Lead Architect & Engineer' })
	@IsString()
	@IsOptional()
	role?: string

	@ApiPropertyOptional({ example: true, default: false })
	@IsBoolean()
	@IsOptional()
	featured?: boolean

	@ApiPropertyOptional({ enum: ProjectStatus, default: ProjectStatus.COMPLETED })
	@IsEnum(ProjectStatus)
	@IsOptional()
	status?: ProjectStatus

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
	tags?: string[]

	@ApiPropertyOptional({
		example: ['TypeScript', 'Tailwind CSS', 'Docker', 'Prisma'],
		type: [String],
	})
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	technologies?: string[]

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
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}

const PROJECT_SORT_FIELDS = [
	'title',
	'category',
	'status',
	'featured',
	'isPublished',
	'sortOrder',
	'createdAt',
	'updatedAt',
] as const

export class QueryProjectDto extends PublishFilterDto {
	@ApiPropertyOptional({ enum: [...PROJECT_SORT_FIELDS] })
	@IsIn(PROJECT_SORT_FIELDS)
	@IsOptional()
	sortBy?: (typeof PROJECT_SORT_FIELDS)[number]

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
	@ToBoolean()
	@IsBoolean()
	@IsOptional()
	featured?: boolean
}

export class AddGalleryMediaDto extends SortableDto {
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
	isFeatured?: boolean

	@ApiPropertyOptional({ example: true, default: true })
	@IsBoolean()
	@IsOptional()
	isVisible?: boolean
}

export class UpdateGalleryMediaDto extends PartialType(AddGalleryMediaDto) {}
