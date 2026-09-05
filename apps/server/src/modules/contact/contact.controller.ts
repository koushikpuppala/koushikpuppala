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
import { ApiTags } from '@nestjs/swagger'
import { ContactService } from './contact.service'
import { CreateContactDto, QueryContactDto, UpdateContactDto } from './contact.dto'
import { Public } from 'common/decorators/public.decorator'
import { Roles } from 'common/decorators/roles.decorator'
import { UserRole } from '@repo/prisma'
import { ApiEndpoint } from 'common/decorators/swagger.decorator'
import type { Request } from 'express'

@ApiTags('Contact')
@Controller('contacts')
export class ContactController {
	constructor(private readonly contactService: ContactService) {}

	@Public()
	@Post()
	@ApiEndpoint({
		summary: 'Submit public contact inquiry form (Public)',
		method: 'POST',
		auth: false,
		endpoint: 'POST /api/v1/contacts',
	})
	async submit(@Body() dto: CreateContactDto, @Req() req: Request) {
		const ip = req.context?.ip || req.ip
		const userAgent = req.headers['user-agent']

		return this.contactService.submit(dto, ip, userAgent)
	}

	@Get()
	@Roles(UserRole.ADMIN, UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'List contact inbox submissions (Admin)',
		method: 'GET',
		isPaginated: true,
		endpoint: 'GET /api/v1/contacts',
	})
	async findAll(@Query() query: QueryContactDto) {
		return this.contactService.adminFindAll(query)
	}

	@Get(':id')
	@Roles(UserRole.ADMIN, UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Get contact message by ID and mark as read (Admin)',
		method: 'GET',
		endpoint: 'GET /api/v1/contacts/:id',
	})
	async findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.contactService.findOne(id)
	}

	@Patch(':id')
	@Roles(UserRole.ADMIN, UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Update contact status, priority, or notes (Admin)',
		method: 'PATCH',
		endpoint: 'PATCH /api/v1/contacts/:id',
	})
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() dto: UpdateContactDto,
		@Req() req: Request,
	) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.contactService.update(id, dto, actor)
	}

	@Delete(':id')
	@Roles(UserRole.ADMIN, UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Delete contact message from inbox (Admin)',
		method: 'DELETE',
		endpoint: 'DELETE /api/v1/contacts/:id',
	})
	async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.contactService.remove(id, actor)
	}
}
