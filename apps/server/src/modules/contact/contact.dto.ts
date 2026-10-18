import {
	IsDateString,
	IsEmail,
	IsEnum,
	IsOptional,
	IsString,
	IsUUID,
	MaxLength,
	MinLength,
	IsIn,
} from 'class-validator'
import { SortablePaginationDto } from 'common/dto/pagination.dto'
import { ContactPriority, ContactStatus } from '@repo/prisma'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

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

	@ApiProperty({
		example: 'Hello Koushik, I would love to discuss a full-stack project opportunity with you.',
	})
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
	source?: string

	@ApiPropertyOptional({ description: 'reCAPTCHA v3 token (required when reCAPTCHA is on)' })
	@IsString()
	@IsOptional()
	@MaxLength(4096)
	recaptchaToken?: string
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

const CONTACT_SORT_FIELDS = ['name', 'email', 'subject', 'status', 'priority', 'createdAt'] as const

export class QueryContactDto extends SortablePaginationDto {
	@ApiPropertyOptional({ enum: [...CONTACT_SORT_FIELDS] })
	@IsIn(CONTACT_SORT_FIELDS)
	@IsOptional()
	sortBy?: (typeof CONTACT_SORT_FIELDS)[number]

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

	@ApiPropertyOptional({ example: '2026-01-01', description: 'Received on or after this date' })
	@IsDateString()
	@IsOptional()
	from?: string

	@ApiPropertyOptional({ example: '2026-01-31', description: 'Received on or before this date' })
	@IsDateString()
	@IsOptional()
	to?: string
}
