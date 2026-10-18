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
import { MetadataService } from './metadata.service'
import { Roles } from 'common/decorators/roles.decorator'
import { Public } from 'common/decorators/public.decorator'
import { ApiEndpoint } from 'common/decorators/swagger.decorator'
import { CreateMetadataDto, QueryMetadataDto, UpdateMetadataDto } from './metadata.dto'
import { RevalidateTags } from 'common/decorators/revalidate.decorator'

@ApiTags('Metadata')
@RevalidateTags('metadata')
@Controller('metadata')
export class MetadataController {
	constructor(private readonly metadataService: MetadataService) {}

	@Public()
	@Get('by-path')
	@ApiEndpoint({
		summary: 'Get published SEO/layout metadata by page pathname (Public)',
		method: 'GET',
		auth: false,
		endpoint: 'GET /api/v1/metadata/by-path',
	})
	async getByPath(@Query('pathname') pathname?: string, @Query('path') path?: string) {
		const target = pathname || path || '/'
		return this.metadataService.getPublishedByPath(target)
	}

	@Public()
	@Get('key/:key')
	@ApiEndpoint({
		summary: 'Get published SEO/layout metadata by unique key or encoded pathname (Public)',
		method: 'GET',
		auth: false,
		endpoint: 'GET /api/v1/metadata/key/:key',
	})
	async getByKey(@Param('key') key: string) {
		const decoded = decodeURIComponent(key)
		return this.metadataService.getPublishedByPath(decoded)
	}

	@Public()
	@Get('published')
	@ApiEndpoint({
		summary: 'Get all published metadata records for SSR/SSG (Public)',
		method: 'GET',
		auth: false,
		isArray: true,
		endpoint: 'GET /api/v1/metadata/published',
	})
	async getAllPublished() {
		return this.metadataService.getAllPublished()
	}

	@Get()
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'List all metadata entries (Admin)',
		method: 'GET',
		isPaginated: true,
		endpoint: 'GET /api/v1/metadata',
	})
	async findAll(@Query() query: QueryMetadataDto) {
		return this.metadataService.adminFindAll(query)
	}

	@Get(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Get metadata entry by ID (Admin)',
		method: 'GET',
		endpoint: 'GET /api/v1/metadata/:id',
	})
	async findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.metadataService.findOne(id)
	}

	@Post()
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Create metadata entry (Admin)',
		method: 'POST',
		endpoint: 'POST /api/v1/metadata',
	})
	async create(@Body() dto: CreateMetadataDto, @Actor() actor: string) {
		return this.metadataService.create(dto, actor)
	}

	@Patch(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Update metadata entry (Admin)',
		method: 'PATCH',
		endpoint: 'PATCH /api/v1/metadata/:id',
	})
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() dto: UpdateMetadataDto,
		@Actor() actor: string,
	) {
		return this.metadataService.update(id, dto, actor)
	}

	@Patch(':id/publish')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Toggle publish status of metadata entry (Admin)',
		method: 'PATCH',
		endpoint: 'PATCH /api/v1/metadata/:id/publish',
	})
	async togglePublish(@Param('id', ParseUUIDPipe) id: string, @Actor() actor: string) {
		return this.metadataService.togglePublish(id, actor)
	}

	@Delete(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Soft-delete metadata entry (Admin)',
		method: 'DELETE',
		endpoint: 'DELETE /api/v1/metadata/:id',
	})
	async remove(@Param('id', ParseUUIDPipe) id: string, @Actor() actor: string) {
		return this.metadataService.remove(id, actor)
	}
}
