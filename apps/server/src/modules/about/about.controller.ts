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
import { AboutService } from './about.service'
import { Roles } from 'common/decorators/roles.decorator'
import { Public } from 'common/decorators/public.decorator'
import { ApiEndpoint } from 'common/decorators/swagger.decorator'
import { CreateAboutDto, QueryAboutDto, UpdateAboutDto } from './about.dto'

@ApiTags('About')
@Controller('about')
export class AboutController {
	constructor(private readonly aboutService: AboutService) {}

	@Public()
	@Get('published')
	@ApiEndpoint({
		method: 'GET',
		auth: false,
		endpoint: 'GET /api/v1/about/published',
		summary: 'Get active published about section (Public)',
	})
	async getPublished() {
		return this.aboutService.getPublished()
	}

	@Get()
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		method: 'GET',
		isPaginated: true,
		endpoint: 'GET /api/v1/about',
		summary: 'List all about records (Admin)',
	})
	async findAll(@Query() query: QueryAboutDto) {
		return this.aboutService.adminFindAll(query)
	}

	@Get(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		method: 'GET',
		endpoint: 'GET /api/v1/about/:id',
		summary: 'Get about record by ID (Admin)',
	})
	async findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.aboutService.findOne(id)
	}

	@Post()
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		method: 'POST',
		endpoint: 'POST /api/v1/about',
		summary: 'Create about entry (Admin)',
	})
	async create(@Body() dto: CreateAboutDto, @Req() req: Request) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.aboutService.create(dto, actor)
	}

	@Patch(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		method: 'PATCH',
		endpoint: 'PATCH /api/v1/about/:id',
		summary: 'Update about entry (Admin)',
	})
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() dto: UpdateAboutDto,
		@Req() req: Request,
	) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.aboutService.update(id, dto, actor)
	}

	@Patch(':id/publish')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		method: 'PATCH',
		endpoint: 'PATCH /api/v1/about/:id/publish',
		summary: 'Toggle publish status of about entry (Admin)',
	})
	async togglePublish(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.aboutService.togglePublish(id, actor)
	}

	@Delete(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		method: 'DELETE',
		endpoint: 'DELETE /api/v1/about/:id',
		summary: 'Soft-delete about entry (Admin)',
	})
	async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.aboutService.remove(id, actor)
	}
}
