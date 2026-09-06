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
import { ExperienceService } from './experience.service'
import { Roles } from 'common/decorators/roles.decorator'
import { Public } from 'common/decorators/public.decorator'
import { ApiEndpoint } from 'common/decorators/swagger.decorator'
import { CreateExperienceDto, QueryExperienceDto, UpdateExperienceDto } from './experience.dto'

@ApiTags('Experience')
@Controller('experience')
export class ExperienceController {
	constructor(private readonly experienceService: ExperienceService) {}

	@Public()
	@Get('published')
	@ApiEndpoint({
		summary: 'Get all published work experiences (Public)',
		method: 'GET',
		auth: false,
		isArray: true,
		endpoint: 'GET /api/v1/experience/published',
	})
	async getPublished() {
		return this.experienceService.getPublished()
	}

	@Get()
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'List all experience records (Admin)',
		method: 'GET',
		isPaginated: true,
		endpoint: 'GET /api/v1/experience',
	})
	async findAll(@Query() query: QueryExperienceDto) {
		return this.experienceService.adminFindAll(query)
	}

	@Get(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Get experience record by ID (Admin)',
		method: 'GET',
		endpoint: 'GET /api/v1/experience/:id',
	})
	async findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.experienceService.findOne(id)
	}

	@Post()
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Create experience entry (Admin)',
		method: 'POST',
		endpoint: 'POST /api/v1/experience',
	})
	async create(@Body() dto: CreateExperienceDto, @Req() req: Request) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.experienceService.create(dto, actor)
	}

	@Patch(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Update experience entry (Admin)',
		method: 'PATCH',
		endpoint: 'PATCH /api/v1/experience/:id',
	})
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() dto: UpdateExperienceDto,
		@Req() req: Request,
	) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.experienceService.update(id, dto, actor)
	}

	@Patch(':id/publish')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Toggle publish status of experience entry (Admin)',
		method: 'PATCH',
		endpoint: 'PATCH /api/v1/experience/:id/publish',
	})
	async togglePublish(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.experienceService.togglePublish(id, actor)
	}

	@Delete(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Soft-delete experience entry (Admin)',
		method: 'DELETE',
		endpoint: 'DELETE /api/v1/experience/:id',
	})
	async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.experienceService.remove(id, actor)
	}
}
