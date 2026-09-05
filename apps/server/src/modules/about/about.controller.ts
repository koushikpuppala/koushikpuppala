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
import { AboutService } from './about.service'
import { CreateAboutDto, QueryAboutDto, UpdateAboutDto } from './about.dto'
import { Public } from 'common/decorators/public.decorator'
import { Roles } from 'common/decorators/roles.decorator'
import { UserRole } from '@repo/prisma'
import { ApiEndpoint } from 'common/decorators/swagger.decorator'
import type { Request } from 'express'

@ApiTags('About')
@Controller('about')
export class AboutController {
	constructor(private readonly aboutService: AboutService) {}

	@Public()
	@Get('published')
	@ApiEndpoint({
		summary: 'Get active published about section (Public)',
		method: 'GET',
		auth: false,
		endpoint: 'GET /api/v1/about/published',
	})
	async getPublished() {
		return this.aboutService.getPublished()
	}

	@Get()
	@Roles(UserRole.ADMIN, UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'List all about records (Admin)',
		method: 'GET',
		isPaginated: true,
		endpoint: 'GET /api/v1/about',
	})
	async findAll(@Query() query: QueryAboutDto) {
		return this.aboutService.adminFindAll(query)
	}

	@Get(':id')
	@Roles(UserRole.ADMIN, UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Get about record by ID (Admin)',
		method: 'GET',
		endpoint: 'GET /api/v1/about/:id',
	})
	async findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.aboutService.findOne(id)
	}

	@Post()
	@Roles(UserRole.ADMIN, UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Create about entry (Admin)',
		method: 'POST',
		endpoint: 'POST /api/v1/about',
	})
	async create(@Body() dto: CreateAboutDto, @Req() req: Request) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.aboutService.create(dto, actor)
	}

	@Patch(':id')
	@Roles(UserRole.ADMIN, UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Update about entry (Admin)',
		method: 'PATCH',
		endpoint: 'PATCH /api/v1/about/:id',
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
	@Roles(UserRole.ADMIN, UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Toggle publish status of about entry (Admin)',
		method: 'PATCH',
		endpoint: 'PATCH /api/v1/about/:id/publish',
	})
	async togglePublish(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.aboutService.togglePublish(id, actor)
	}

	@Delete(':id')
	@Roles(UserRole.ADMIN, UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Soft-delete about entry (Admin)',
		method: 'DELETE',
		endpoint: 'DELETE /api/v1/about/:id',
	})
	async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.aboutService.remove(id, actor)
	}
}
