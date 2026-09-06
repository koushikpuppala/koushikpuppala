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
import { SkillService } from './skill.service'
import { Roles } from 'common/decorators/roles.decorator'
import { Public } from 'common/decorators/public.decorator'
import { ApiEndpoint } from 'common/decorators/swagger.decorator'
import { CreateSkillDto, QuerySkillDto, UpdateSkillDto } from './skill.dto'

@ApiTags('Skills')
@Controller('skills')
export class SkillController {
	constructor(private readonly skillService: SkillService) {}

	@Public()
	@Get('published')
	@ApiEndpoint({
		summary: 'Get all published skills (Public)',
		method: 'GET',
		auth: false,
		isArray: true,
		endpoint: 'GET /api/v1/skills/published',
	})
	async getPublished(@Query('category') category?: string) {
		return this.skillService.getPublished(category)
	}

	@Get()
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'List all skills (Admin)',
		method: 'GET',
		isPaginated: true,
		endpoint: 'GET /api/v1/skills',
	})
	async findAll(@Query() query: QuerySkillDto) {
		return this.skillService.adminFindAll(query)
	}

	@Get(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Get skill by ID (Admin)',
		method: 'GET',
		endpoint: 'GET /api/v1/skills/:id',
	})
	async findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.skillService.findOne(id)
	}

	@Post()
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Create skill (Admin)',
		method: 'POST',
		endpoint: 'POST /api/v1/skills',
	})
	async create(@Body() dto: CreateSkillDto, @Req() req: Request) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.skillService.create(dto, actor)
	}

	@Patch(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Update skill (Admin)',
		method: 'PATCH',
		endpoint: 'PATCH /api/v1/skills/:id',
	})
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() dto: UpdateSkillDto,
		@Req() req: Request,
	) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.skillService.update(id, dto, actor)
	}

	@Patch(':id/publish')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Toggle publish status of skill (Admin)',
		method: 'PATCH',
		endpoint: 'PATCH /api/v1/skills/:id/publish',
	})
	async togglePublish(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.skillService.togglePublish(id, actor)
	}

	@Delete(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Soft-delete skill (Admin)',
		method: 'DELETE',
		endpoint: 'DELETE /api/v1/skills/:id',
	})
	async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.skillService.remove(id, actor)
	}
}
