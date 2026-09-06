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
import { ResumeService } from './resume.service'
import { Roles } from 'common/decorators/roles.decorator'
import { Public } from 'common/decorators/public.decorator'
import { ApiEndpoint } from 'common/decorators/swagger.decorator'
import { CreateResumeDto, QueryResumeDto, UpdateResumeDto } from './resume.dto'

@ApiTags('Resume')
@Controller('resume')
export class ResumeController {
	constructor(private readonly resumeService: ResumeService) {}

	@Public()
	@Get('latest')
	@ApiEndpoint({
		summary: 'Get the active published resume and access URL (Public)',
		method: 'GET',
		auth: false,
		endpoint: 'GET /api/v1/resume/latest',
	})
	async getLatest() {
		return this.resumeService.getLatest()
	}

	@Public()
	@Get('download')
	@ApiEndpoint({
		summary: 'Track download count and retrieve download URL (Public)',
		method: 'GET',
		auth: false,
		endpoint: 'GET /api/v1/resume/download',
	})
	async trackDownload() {
		return this.resumeService.trackDownloadAndGetUrl()
	}

	@Get()
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'List all resume versions (Admin)',
		method: 'GET',
		isPaginated: true,
		endpoint: 'GET /api/v1/resume',
	})
	async findAll(@Query() query: QueryResumeDto) {
		return this.resumeService.adminFindAll(query)
	}

	@Get(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Get resume record by ID (Admin)',
		method: 'GET',
		endpoint: 'GET /api/v1/resume/:id',
	})
	async findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.resumeService.findOne(id)
	}

	@Post()
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Upload/register new resume version (Admin)',
		method: 'POST',
		endpoint: 'POST /api/v1/resume',
	})
	async create(@Body() dto: CreateResumeDto, @Req() req: Request) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.resumeService.create(dto, actor)
	}

	@Patch(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Update resume version (Admin)',
		method: 'PATCH',
		endpoint: 'PATCH /api/v1/resume/:id',
	})
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() dto: UpdateResumeDto,
		@Req() req: Request,
	) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.resumeService.update(id, dto, actor)
	}

	@Patch(':id/publish')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Toggle publish status of resume version (Admin)',
		method: 'PATCH',
		endpoint: 'PATCH /api/v1/resume/:id/publish',
	})
	async togglePublish(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.resumeService.togglePublish(id, actor)
	}

	@Delete(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Soft-delete resume version (Admin)',
		method: 'DELETE',
		endpoint: 'DELETE /api/v1/resume/:id',
	})
	async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.resumeService.remove(id, actor)
	}
}
