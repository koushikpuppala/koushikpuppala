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
import { EducationService } from './education.service'
import { Roles } from 'common/decorators/roles.decorator'
import { Public } from 'common/decorators/public.decorator'
import { ApiEndpoint } from 'common/decorators/swagger.decorator'
import { CreateEducationDto, QueryEducationDto, UpdateEducationDto } from './education.dto'

@ApiTags('Education')
@Controller('education')
export class EducationController {
	constructor(private readonly educationService: EducationService) {}

	@Public()
	@Get('published')
	@ApiEndpoint({
		summary: 'Get all published education records (Public)',
		method: 'GET',
		auth: false,
		isArray: true,
		endpoint: 'GET /api/v1/education/published',
	})
	async getPublished() {
		return this.educationService.getPublished()
	}

	@Get()
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'List all education records (Admin)',
		method: 'GET',
		isPaginated: true,
		endpoint: 'GET /api/v1/education',
	})
	async findAll(@Query() query: QueryEducationDto) {
		return this.educationService.adminFindAll(query)
	}

	@Get(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Get education record by ID (Admin)',
		method: 'GET',
		endpoint: 'GET /api/v1/education/:id',
	})
	async findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.educationService.findOne(id)
	}

	@Post()
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Create education entry (Admin)',
		method: 'POST',
		endpoint: 'POST /api/v1/education',
	})
	async create(@Body() dto: CreateEducationDto, @Req() req: Request) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.educationService.create(dto, actor)
	}

	@Patch(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Update education entry (Admin)',
		method: 'PATCH',
		endpoint: 'PATCH /api/v1/education/:id',
	})
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() dto: UpdateEducationDto,
		@Req() req: Request,
	) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.educationService.update(id, dto, actor)
	}

	@Patch(':id/publish')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Toggle publish status of education entry (Admin)',
		method: 'PATCH',
		endpoint: 'PATCH /api/v1/education/:id/publish',
	})
	async togglePublish(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.educationService.togglePublish(id, actor)
	}

	@Delete(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Soft-delete education entry (Admin)',
		method: 'DELETE',
		endpoint: 'DELETE /api/v1/education/:id',
	})
	async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.educationService.remove(id, actor)
	}
}
