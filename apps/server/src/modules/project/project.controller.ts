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
import { ProjectService } from './project.service'
import {
	AddGalleryMediaDto,
	CreateProjectDto,
	QueryProjectDto,
	UpdateGalleryMediaDto,
	UpdateProjectDto,
} from './project.dto'
import { Public } from 'common/decorators/public.decorator'
import { Roles } from 'common/decorators/roles.decorator'
import { UserRole } from '@repo/prisma'
import { ApiEndpoint } from 'common/decorators/swagger.decorator'
import type { Request } from 'express'

@ApiTags('Projects')
@Controller('projects')
export class ProjectController {
	constructor(private readonly projectService: ProjectService) {}

	@Public()
	@Get('published')
	@ApiEndpoint({
		summary: 'Get all published projects (Public)',
		method: 'GET',
		auth: false,
		isArray: true,
		endpoint: 'GET /api/v1/projects/published',
	})
	async getPublished(
		@Query('category') category?: string,
		@Query('featured') featured?: boolean,
	) {
		return this.projectService.getPublished({ category, featured })
	}

	@Public()
	@Get('published/:slug')
	@ApiEndpoint({
		summary: 'Get published project by slug with full gallery (Public)',
		method: 'GET',
		auth: false,
		endpoint: 'GET /api/v1/projects/published/:slug',
	})
	async getBySlug(@Param('slug') slug: string) {
		return this.projectService.getBySlug(slug)
	}

	@Get()
	@Roles(UserRole.ADMIN, UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'List all projects (Admin)',
		method: 'GET',
		isPaginated: true,
		endpoint: 'GET /api/v1/projects',
	})
	async findAll(@Query() query: QueryProjectDto) {
		return this.projectService.adminFindAll(query)
	}

	@Get(':id')
	@Roles(UserRole.ADMIN, UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Get project by ID (Admin)',
		method: 'GET',
		endpoint: 'GET /api/v1/projects/:id',
	})
	async findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.projectService.findOne(id)
	}

	@Post()
	@Roles(UserRole.ADMIN, UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Create project (Admin)',
		method: 'POST',
		endpoint: 'POST /api/v1/projects',
	})
	async create(@Body() dto: CreateProjectDto, @Req() req: Request) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.projectService.create(dto, actor)
	}

	@Patch(':id')
	@Roles(UserRole.ADMIN, UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Update project (Admin)',
		method: 'PATCH',
		endpoint: 'PATCH /api/v1/projects/:id',
	})
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() dto: UpdateProjectDto,
		@Req() req: Request,
	) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.projectService.update(id, dto, actor)
	}

	@Patch(':id/publish')
	@Roles(UserRole.ADMIN, UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Toggle publish status of project (Admin)',
		method: 'PATCH',
		endpoint: 'PATCH /api/v1/projects/:id/publish',
	})
	async togglePublish(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.projectService.togglePublish(id, actor)
	}

	@Delete(':id')
	@Roles(UserRole.ADMIN, UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Soft-delete project (Admin)',
		method: 'DELETE',
		endpoint: 'DELETE /api/v1/projects/:id',
	})
	async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.projectService.remove(id, actor)
	}

	// --- Gallery Endpoints ---
	@Post(':id/gallery')
	@Roles(UserRole.ADMIN, UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Add media asset to project gallery (Admin)',
		method: 'POST',
		endpoint: 'POST /api/v1/projects/:id/gallery',
	})
	async addGalleryMedia(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() dto: AddGalleryMediaDto,
		@Req() req: Request,
	) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.projectService.addGalleryMedia(id, dto, actor)
	}

	@Patch(':id/gallery/:mediaId')
	@Roles(UserRole.ADMIN, UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Update gallery media metadata/order (Admin)',
		method: 'PATCH',
		endpoint: 'PATCH /api/v1/projects/:id/gallery/:mediaId',
	})
	async updateGalleryMedia(
		@Param('id', ParseUUIDPipe) id: string,
		@Param('mediaId', ParseUUIDPipe) mediaId: string,
		@Body() dto: UpdateGalleryMediaDto,
		@Req() req: Request,
	) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.projectService.updateGalleryMedia(id, mediaId, dto, actor)
	}

	@Delete(':id/gallery/:mediaId')
	@Roles(UserRole.ADMIN, UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Remove media asset from project gallery (Admin)',
		method: 'DELETE',
		endpoint: 'DELETE /api/v1/projects/:id/gallery/:mediaId',
	})
	async removeGalleryMedia(
		@Param('id', ParseUUIDPipe) id: string,
		@Param('mediaId', ParseUUIDPipe) mediaId: string,
		@Req() req: Request,
	) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.projectService.removeGalleryMedia(id, mediaId, actor)
	}
}
