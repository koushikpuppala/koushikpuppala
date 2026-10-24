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
import { ServiceService } from './service.service'
import { Roles } from 'common/decorators/roles.decorator'
import { Public } from 'common/decorators/public.decorator'
import { ApiEndpoint } from 'common/decorators/swagger.decorator'
import { CreateServiceDto, QueryServiceDto, UpdateServiceDto } from './service.dto'
import { RevalidateTags } from 'common/decorators/revalidate.decorator'

@ApiTags('Services')
@RevalidateTags('services')
@Controller('services')
export class ServiceController {
	constructor(private readonly serviceService: ServiceService) {}

	@Public()
	@Get('published')
	@ApiEndpoint({
		summary: 'Get all published services (Public)',
		method: 'GET',
		auth: false,
		isArray: true,
		endpoint: 'GET /api/v1/services/published',
	})
	async getPublished() {
		return this.serviceService.getPublished()
	}

	@Get()
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'List all services (Admin)',
		method: 'GET',
		isPaginated: true,
		endpoint: 'GET /api/v1/services',
	})
	async findAll(@Query() query: QueryServiceDto) {
		return this.serviceService.adminFindAll(query)
	}

	@Get(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Get service by ID (Admin)',
		method: 'GET',
		endpoint: 'GET /api/v1/services/:id',
	})
	async findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.serviceService.findOne(id)
	}

	@Post()
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Create service (Admin)',
		method: 'POST',
		endpoint: 'POST /api/v1/services',
	})
	async create(@Body() dto: CreateServiceDto, @Actor() actor: string) {
		return this.serviceService.create(dto, actor)
	}

	@Patch(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Update service (Admin)',
		method: 'PATCH',
		endpoint: 'PATCH /api/v1/services/:id',
	})
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() dto: UpdateServiceDto,
		@Actor() actor: string,
	) {
		return this.serviceService.update(id, dto, actor)
	}

	@Patch(':id/publish')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Toggle publish status of service (Admin)',
		method: 'PATCH',
		endpoint: 'PATCH /api/v1/services/:id/publish',
	})
	async togglePublish(@Param('id', ParseUUIDPipe) id: string, @Actor() actor: string) {
		return this.serviceService.togglePublish(id, actor)
	}

	@Delete(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Soft-delete service (Admin)',
		method: 'DELETE',
		endpoint: 'DELETE /api/v1/services/:id',
	})
	async remove(@Param('id', ParseUUIDPipe) id: string, @Actor() actor: string) {
		return this.serviceService.remove(id, actor)
	}
}
