import type { Request } from 'express'

import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
	Req,
} from '@nestjs/common'
import { UserRole } from '@repo/prisma'
import { ApiTags } from '@nestjs/swagger'
import { Actor } from 'common/decorators/actor.decorator'
import { ContactService } from './contact.service'
import { RecaptchaService } from './recaptcha.service'
import { Roles } from 'common/decorators/roles.decorator'
import { Public } from 'common/decorators/public.decorator'
import { Throttle } from '@nestjs/throttler'
import { ApiEndpoint } from 'common/decorators/swagger.decorator'
import { CreateContactDto, QueryContactDto, UpdateContactDto } from './contact.dto'

@ApiTags('Contact')
@Controller('contacts')
export class ContactController {
	constructor(
		private readonly contactService: ContactService,
		private readonly recaptcha: RecaptchaService,
	) {}

	@Public()
	// Five submissions a minute per client, on top of the honeypot and reCAPTCHA checks.
	@Throttle({ default: { limit: 5, ttl: 60_000 } })
	@Post()
	@ApiEndpoint({
		method: 'POST',
		auth: false,
		endpoint: 'POST /api/v1/contacts',
		summary: 'Submit public contact inquiry form (Public)',
	})
	async submit(@Body() dto: CreateContactDto, @Req() req: Request) {
		const ip = req.context?.ip || req.ip
		const userAgent = req.headers['user-agent']

		await this.recaptcha.verify(dto.recaptchaToken, ip)

		return this.contactService.submit(dto, ip, userAgent)
	}

	@Get()
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		method: 'GET',
		isPaginated: true,
		endpoint: 'GET /api/v1/contacts',
		summary: 'List contact inbox submissions (Admin)',
	})
	async findAll(@Query() query: QueryContactDto) {
		return this.contactService.adminFindAll(query)
	}

	@Get(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		method: 'GET',
		endpoint: 'GET /api/v1/contacts/:id',
		summary: 'Get contact message by ID and mark as read (Admin)',
	})
	async findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.contactService.findOne(id)
	}

	@Patch(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		method: 'PATCH',
		endpoint: 'PATCH /api/v1/contacts/:id',
		summary: 'Update contact status, priority, or notes (Admin)',
	})
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() dto: UpdateContactDto,
		@Actor() actor: string,
	) {
		return this.contactService.update(id, dto, actor)
	}

	@Delete(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		method: 'DELETE',
		endpoint: 'DELETE /api/v1/contacts/:id',
		summary: 'Delete contact message from inbox (Admin)',
	})
	async remove(@Param('id', ParseUUIDPipe) id: string, @Actor() actor: string) {
		return this.contactService.remove(id, actor)
	}
}
