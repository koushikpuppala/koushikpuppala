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
import { HomeService } from './home.service'
import { CreateHomeDto, QueryHomeDto, UpdateHomeDto } from './home.dto'
import { Public } from 'common/decorators/public.decorator'
import { Roles } from 'common/decorators/roles.decorator'
import { UserRole } from '@repo/prisma'
import { ApiEndpoint } from 'common/decorators/swagger.decorator'
import type { Request } from 'express'

@ApiTags('Home')
@Controller('home')
export class HomeController {
	constructor(private readonly homeService: HomeService) {}

	@Public()
	@Get('published')
	@ApiEndpoint({
		summary: 'Get active published homepage content (Public)',
		method: 'GET',
		auth: false,
		endpoint: 'GET /api/v1/home/published',
	})
	async getPublished() {
		return this.homeService.getPublished()
	}

	@Get()
	@Roles(UserRole.ADMIN, UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'List all homepage entries (Admin)',
		method: 'GET',
		isPaginated: true,
		endpoint: 'GET /api/v1/home',
	})
	async findAll(@Query() query: QueryHomeDto) {
		return this.homeService.adminFindAll(query)
	}

	@Get(':id')
	@Roles(UserRole.ADMIN, UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Get homepage entry by ID (Admin)',
		method: 'GET',
		endpoint: 'GET /api/v1/home/:id',
	})
	async findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.homeService.findOne(id)
	}

	@Post()
	@Roles(UserRole.ADMIN, UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Create homepage entry (Admin)',
		method: 'POST',
		endpoint: 'POST /api/v1/home',
	})
	async create(@Body() dto: CreateHomeDto, @Req() req: Request) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.homeService.create(dto, actor)
	}

	@Patch(':id')
	@Roles(UserRole.ADMIN, UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Update homepage entry (Admin)',
		method: 'PATCH',
		endpoint: 'PATCH /api/v1/home/:id',
	})
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() dto: UpdateHomeDto,
		@Req() req: Request,
	) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.homeService.update(id, dto, actor)
	}

	@Patch(':id/publish')
	@Roles(UserRole.ADMIN, UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Toggle publish status of homepage entry (Admin)',
		method: 'PATCH',
		endpoint: 'PATCH /api/v1/home/:id/publish',
	})
	async togglePublish(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.homeService.togglePublish(id, actor)
	}

	@Delete(':id')
	@Roles(UserRole.ADMIN, UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Soft-delete homepage entry (Admin)',
		method: 'DELETE',
		endpoint: 'DELETE /api/v1/home/:id',
	})
	async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.homeService.remove(id, actor)
	}
}
