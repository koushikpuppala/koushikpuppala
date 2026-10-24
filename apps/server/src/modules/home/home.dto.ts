import { PublishableDto, PublishPageDto } from 'common/dto/publishable.dto'
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsObject, IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateHomeDto extends PublishableDto {
	@ApiProperty({ example: 'Koushik Puppala' })
	@IsString()
	@IsNotEmpty()
	title!: string

	@ApiPropertyOptional({ example: '|', default: '|' })
	@IsString()
	@IsOptional()
	separator?: string

	@ApiProperty({
		example: ['Software Engineer', 'Full Stack Developer', 'Open Source Contributor'],
		type: [String],
	})
	@IsArray()
	@IsString({ each: true })
	subtitles!: string[]

	@ApiProperty({
		example:
			'Passionate software engineer focused on building scalable, reliable full-stack applications.',
	})
	@IsString()
	content!: string

	@ApiPropertyOptional({ example: 'View Projects', default: 'View Projects' })
	@IsString()
	@IsOptional()
	ctaLabel?: string

	@ApiPropertyOptional({ example: '/projects', default: '/projects' })
	@IsString()
	@IsOptional()
	ctaUrl?: string

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
	featuredSkills?: string[]

	@ApiPropertyOptional({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
	@IsUUID()
	@IsOptional()
	profileImageId?: string
}

export class UpdateHomeDto extends PartialType(CreateHomeDto) {}

export class QueryHomeDto extends PublishPageDto {
	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	search?: string
}
