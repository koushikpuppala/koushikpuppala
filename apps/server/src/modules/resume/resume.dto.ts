import { PublishableDto, PublishPageDto } from 'common/dto/publishable.dto'
import type { ResumeHighlight, ResumeStat } from 'types'

import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateResumeDto extends PublishableDto {
	@ApiProperty({ example: 'Koushik Puppala - Resume 2026' })
	@IsString()
	@IsNotEmpty()
	title!: string

	@ApiPropertyOptional({ example: 'v2026.1' })
	@IsString()
	@IsOptional()
	versionName?: string

	@ApiPropertyOptional({ example: 'Software Engineer & Full-Stack Systems Architect' })
	@IsString()
	@IsOptional()
	headline?: string

	@ApiPropertyOptional({
		example: 'Senior Full Stack Engineer specializing in scalable NestJS and Next.js applications.',
		description: 'Executive resume narrative and summary',
	})
	@IsString()
	@IsOptional()
	summary?: string

	@ApiPropertyOptional({
		example: [
			{ number: '01', title: 'PRODUCTION ENGINEERING', description: 'Engineered features...' },
		],
	})
	@IsOptional()
	highlights?: ResumeHighlight[] | Record<string, unknown>[]

	@ApiPropertyOptional({
		example: ['TypeScript', 'Next.js 16', 'NestJS 11', 'PostgreSQL'],
		type: [String],
	})
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	competencies?: string[]

	@ApiPropertyOptional({ example: [{ label: 'FORMAT', value: 'PDF 1.4' }] })
	@IsOptional()
	stats?: ResumeStat[] | Record<string, unknown>[]

	@ApiProperty({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
	@IsUUID()
	mediaId!: string

	@ApiPropertyOptional({ example: 254100, description: 'File size in bytes' })
	@IsInt()
	@IsOptional()
	fileSize?: number

	@ApiPropertyOptional({ example: 'application/pdf', default: 'application/pdf' })
	@IsString()
	@IsOptional()
	fileType?: string

	@ApiPropertyOptional({
		example: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
	})
	@IsString()
	@IsOptional()
	checksum?: string
}

export class UpdateResumeDto extends PartialType(CreateResumeDto) {}

export class QueryResumeDto extends PublishPageDto {
	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	search?: string
}
