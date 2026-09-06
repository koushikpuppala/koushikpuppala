import { MediaType } from '@repo/prisma'
import { PaginationDto } from 'common/dto/pagination.dto'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

export class RequestPresignedUploadDto {
	@ApiProperty({ example: 'portfolio-hero.webp' })
	@IsString()
	originalName!: string

	@ApiProperty({ example: 'image/webp' })
	@IsString()
	mimeType!: string

	@ApiProperty({ example: 1048576, description: 'File size in bytes (max 50MB)' })
	@IsInt()
	@Min(1)
	@Max(52428800) // 50MB
	size!: number

	@ApiProperty({ enum: MediaType, example: MediaType.IMAGE })
	@IsEnum(MediaType)
	type!: MediaType

	@ApiPropertyOptional({ example: 'projects', description: 'Folder or category for asset' })
	@IsString()
	@IsOptional()
	folder?: string = 'general'
}

export class PresignedUploadResponseDto {
	@ApiProperty({ example: 'https://s3.amazonaws.com/bucket/key?signature...' })
	uploadUrl!: string

	@ApiProperty({ example: 'projects/123456-portfolio-hero.webp' })
	storageKey!: string

	@ApiProperty({ example: 'https://cdn.koushikpuppala.com/projects/123456-portfolio-hero.webp' })
	url!: string
}

export class CompleteMediaUploadDto {
	@ApiProperty({ example: 'projects/123456-portfolio-hero.webp' })
	@IsString()
	storageKey!: string

	@ApiProperty({ example: 'portfolio-hero.webp' })
	@IsString()
	originalName!: string

	@ApiProperty({ example: 'image/webp' })
	@IsString()
	mimeType!: string

	@ApiProperty({ example: 1048576 })
	@IsInt()
	@Min(1)
	size!: number

	@ApiProperty({ enum: MediaType, example: MediaType.IMAGE })
	@IsEnum(MediaType)
	type!: MediaType

	@ApiPropertyOptional({ example: 'projects' })
	@IsString()
	@IsOptional()
	folder?: string

	@ApiPropertyOptional({ example: 1920 })
	@IsInt()
	@IsOptional()
	width?: number

	@ApiPropertyOptional({ example: 1080 })
	@IsInt()
	@IsOptional()
	height?: number

	@ApiPropertyOptional({ example: 'Personal portfolio dark theme hero banner' })
	@IsString()
	@IsOptional()
	altText?: string

	@ApiPropertyOptional({ example: 'Portfolio Hero Banner' })
	@IsString()
	@IsOptional()
	caption?: string
}

export class UpdateMediaDto {
	@ApiPropertyOptional({ example: 'Updated alt text for accessibility' })
	@IsString()
	@IsOptional()
	altText?: string

	@ApiPropertyOptional({ example: 'Updated caption' })
	@IsString()
	@IsOptional()
	caption?: string
}

export class QueryMediaDto extends PaginationDto {
	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	search?: string

	@ApiPropertyOptional({ enum: MediaType })
	@IsEnum(MediaType)
	@IsOptional()
	type?: MediaType

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	folder?: string
}
