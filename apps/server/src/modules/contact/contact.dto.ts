import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
	IsEmail,
	IsEnum,
	IsOptional,
	IsString,
	IsUUID,
	MaxLength,
	MinLength,
} from 'class-validator'
import { ContactPriority, ContactStatus } from '@repo/prisma'
import { PaginationDto } from 'common/dto/pagination.dto'

export class CreateContactDto {
	@ApiProperty({ example: 'John Doe' })
	@IsString()
	@MinLength(2)
	@MaxLength(100)
	name!: string

	@ApiProperty({ example: 'john.doe@example.com' })
	@IsEmail()
	email!: string

	@ApiProperty({ example: 'Project Inquiry / Collaboration' })
	@IsString()
	@MinLength(3)
	@MaxLength(200)
	subject!: string

	@ApiProperty({ example: 'Hello Koushik, I would love to discuss a full-stack project opportunity with you.' })
	@IsString()
	@MinLength(10)
	@MaxLength(5000)
	message!: string

	@ApiPropertyOptional({ example: 'https://example.com' })
	@IsString()
	@IsOptional()
	url?: string

	@ApiPropertyOptional({ example: 'website' })
	@IsString()
	@IsOptional()
	source?: string = 'website'
}

export class UpdateContactDto {
	@ApiPropertyOptional({ enum: ContactStatus })
	@IsEnum(ContactStatus)
	@IsOptional()
	status?: ContactStatus

	@ApiPropertyOptional({ enum: ContactPriority })
	@IsEnum(ContactPriority)
	@IsOptional()
	priority?: ContactPriority

	@ApiPropertyOptional({ example: 'Followed up via email regarding project scope.' })
	@IsString()
	@IsOptional()
	internalNotes?: string

	@ApiPropertyOptional({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
	@IsUUID()
	@IsOptional()
	assignedToId?: string
}

export class QueryContactDto extends PaginationDto {
	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	search?: string

	@ApiPropertyOptional({ enum: ContactStatus })
	@IsEnum(ContactStatus)
	@IsOptional()
	status?: ContactStatus

	@ApiPropertyOptional({ enum: ContactPriority })
	@IsEnum(ContactPriority)
	@IsOptional()
	priority?: ContactPriority
}
