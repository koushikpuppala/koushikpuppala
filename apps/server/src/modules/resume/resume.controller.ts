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
} from '@nestjs/common'
import { UserRole } from '@repo/prisma'
import { ApiTags } from '@nestjs/swagger'
import { Actor } from 'common/decorators/actor.decorator'
import { ResumeService } from './resume.service'
import { Roles } from 'common/decorators/roles.decorator'
import { Public } from 'common/decorators/public.decorator'
import { ApiEndpoint } from 'common/decorators/swagger.decorator'
import { CreateResumeDto, QueryResumeDto, UpdateResumeDto } from './resume.dto'
import { RevalidateTags } from 'common/decorators/revalidate.decorator'

@ApiTags('Resume')
@RevalidateTags('resume')
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
	async create(@Body() dto: CreateResumeDto, @Actor() actor: string) {
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
		@Actor() actor: string,
	) {
		return this.resumeService.update(id, dto, actor)
	}

	@Patch(':id/publish')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Toggle publish status of resume version (Admin)',
		method: 'PATCH',
		endpoint: 'PATCH /api/v1/resume/:id/publish',
	})
	async togglePublish(@Param('id', ParseUUIDPipe) id: string, @Actor() actor: string) {
		return this.resumeService.togglePublish(id, actor)
	}

	@Delete(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Soft-delete resume version (Admin)',
		method: 'DELETE',
		endpoint: 'DELETE /api/v1/resume/:id',
	})
	async remove(@Param('id', ParseUUIDPipe) id: string, @Actor() actor: string) {
		return this.resumeService.remove(id, actor)
	}
}
