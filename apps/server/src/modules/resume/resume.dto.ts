import { Type } from 'class-transformer'
import { PaginationDto } from 'common/dto/pagination.dto'
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { IsBoolean, IsInt, IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateResumeDto {
	@ApiProperty({ example: 'Koushik Puppala - Resume 2026' })
	@IsString()
	title!: string

	@ApiPropertyOptional({ example: 'v2026.1' })
	@IsString()
	@IsOptional()
	versionName?: string

	@ApiPropertyOptional({
		example: 'Senior Full Stack Engineer specializing in scalable NestJS and Next.js applications.',
		description: 'Executive resume narrative and summary',
	})
	@IsString()
	@IsOptional()
	summary?: string

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
	fileType?: string = 'application/pdf'

	@ApiPropertyOptional({
		example: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
	})
	@IsString()
	@IsOptional()
	checksum?: string

	@ApiPropertyOptional({ example: 0, default: 0 })
	@IsInt()
	@IsOptional()
	sortOrder?: number = 0

	@ApiPropertyOptional({ example: true, default: false })
	@IsBoolean()
	@IsOptional()
	isPublished?: boolean = false
}

export class UpdateResumeDto extends PartialType(CreateResumeDto) {}

export class QueryResumeDto extends PaginationDto {
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
