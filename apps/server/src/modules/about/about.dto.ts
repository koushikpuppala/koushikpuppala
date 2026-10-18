import { PublishableDto, PublishPageDto } from 'common/dto/publishable.dto'
import type { AboutPillar, AboutStat, AboutValue } from 'types/models'

import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateAboutDto extends PublishableDto {
	@ApiProperty({ example: 'About Me' })
	@IsString()
	@IsNotEmpty()
	title!: string

	@ApiPropertyOptional({
		example:
			'Bridging intuitive, high-performance user interfaces with resilient distributed backend systems.',
	})
	@IsString()
	@IsOptional()
	leadStatement?: string

	@ApiProperty({
		example: 'I am a software engineer focused on building robust full-stack applications.',
	})
	@IsString()
	content!: string

	@ApiPropertyOptional({
		example:
			'Detailed background, engineering philosophies, problem-solving journey, and technical leadership experience.',
	})
	@IsString()
	@IsOptional()
	biography?: string

	@ApiPropertyOptional({ example: 'Bengaluru, Karnataka, India' })
	@IsString()
	@IsOptional()
	location?: string

	@ApiPropertyOptional({ example: '12.9716° N, 77.5946° E' })
	@IsString()
	@IsOptional()
	coordinates?: string

	@ApiPropertyOptional({ example: 'UTC+5:30 (IST)' })
	@IsString()
	@IsOptional()
	timezone?: string

	@ApiPropertyOptional({ example: 'AVAILABLE FOR WORK // GLOBAL REMOTE' })
	@IsString()
	@IsOptional()
	status?: string

	@ApiPropertyOptional({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
	@IsUUID()
	@IsOptional()
	profileImageId?: string

	@ApiPropertyOptional({
		example: ['Software Engineer at Upraised', 'GDSC Lead at IIIT Raichur'],
		type: [String],
	})
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	highlights?: string[]

	@ApiPropertyOptional({
		example: ['NestJS', 'Next.js', 'PostgreSQL', 'Redis', 'AWS'],
		type: [String],
	})
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	skills?: string[]

	@ApiPropertyOptional({
		example: [{ label: 'EXPERIENCE', value: '3+', detail: 'Years of Production Engineering' }],
	})
	@IsOptional()
	stats?: AboutStat[] | Record<string, unknown>[]

	@ApiPropertyOptional({
		example: [
			{ title: 'Simplicity over Cleverness', description: 'Favor transparent architecture' },
		],
	})
	@IsOptional()
	values?: AboutValue[] | string[]

	@ApiPropertyOptional({
		example: [{ index: '01', title: 'Clean Boundaries', description: 'Strict module boundaries' }],
	})
	@IsOptional()
	pillars?: AboutPillar[] | Record<string, unknown>[]

	@ApiPropertyOptional({ example: 'Download Resume' })
	@IsString()
	@IsOptional()
	ctaLabel?: string

	@ApiPropertyOptional({ example: '/resume' })
	@IsString()
	@IsOptional()
	ctaUrl?: string
}

export class UpdateAboutDto extends PartialType(CreateAboutDto) {}

export class QueryAboutDto extends PublishPageDto {
	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	search?: string
}
