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
import { HomeService } from './home.service'
import { Roles } from 'common/decorators/roles.decorator'
import { Public } from 'common/decorators/public.decorator'
import { ApiEndpoint } from 'common/decorators/swagger.decorator'
import { CreateHomeDto, QueryHomeDto, UpdateHomeDto } from './home.dto'
import { RevalidateTags } from 'common/decorators/revalidate.decorator'

@ApiTags('Home')
@RevalidateTags('home')
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
	@Roles(UserRole.EDITOR)
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
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Get homepage entry by ID (Admin)',
		method: 'GET',
		endpoint: 'GET /api/v1/home/:id',
	})
	async findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.homeService.findOne(id)
	}

	@Post()
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Create homepage entry (Admin)',
		method: 'POST',
		endpoint: 'POST /api/v1/home',
	})
	async create(@Body() dto: CreateHomeDto, @Actor() actor: string) {
		return this.homeService.create(dto, actor)
	}

	@Patch(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Update homepage entry (Admin)',
		method: 'PATCH',
		endpoint: 'PATCH /api/v1/home/:id',
	})
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() dto: UpdateHomeDto,
		@Actor() actor: string,
	) {
		return this.homeService.update(id, dto, actor)
	}

	@Patch(':id/publish')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Toggle publish status of homepage entry (Admin)',
		method: 'PATCH',
		endpoint: 'PATCH /api/v1/home/:id/publish',
	})
	async togglePublish(@Param('id', ParseUUIDPipe) id: string, @Actor() actor: string) {
		return this.homeService.togglePublish(id, actor)
	}

	@Delete(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Soft-delete homepage entry (Admin)',
		method: 'DELETE',
		endpoint: 'DELETE /api/v1/home/:id',
	})
	async remove(@Param('id', ParseUUIDPipe) id: string, @Actor() actor: string) {
		return this.homeService.remove(id, actor)
	}
}
