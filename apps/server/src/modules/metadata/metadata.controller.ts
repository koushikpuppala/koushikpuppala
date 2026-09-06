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
import { MetadataService } from './metadata.service'
import { Roles } from 'common/decorators/roles.decorator'
import { Public } from 'common/decorators/public.decorator'
import { ApiEndpoint } from 'common/decorators/swagger.decorator'
import { CreateMetadataDto, QueryMetadataDto, UpdateMetadataDto } from './metadata.dto'

@ApiTags('Metadata')
@Controller('metadata')
export class MetadataController {
	constructor(private readonly metadataService: MetadataService) {}

	@Public()
	@Get('key/:key')
	@ApiEndpoint({
		summary: 'Get published SEO/layout metadata by unique key (Public)',
		method: 'GET',
		auth: false,
		endpoint: 'GET /api/v1/metadata/key/:key',
	})
	async getByKey(@Param('key') key: string) {
		return this.metadataService.getPublishedByKey(key)
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
	async create(@Body() dto: CreateMetadataDto, @Req() req: Request) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

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
		@Req() req: Request,
	) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.metadataService.update(id, dto, actor)
	}

	@Patch(':id/publish')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Toggle publish status of metadata entry (Admin)',
		method: 'PATCH',
		endpoint: 'PATCH /api/v1/metadata/:id/publish',
	})
	async togglePublish(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.metadataService.togglePublish(id, actor)
	}

	@Delete(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Soft-delete metadata entry (Admin)',
		method: 'DELETE',
		endpoint: 'DELETE /api/v1/metadata/:id',
	})
	async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
		const actor = req.user?.email ?? req.user?.id ?? 'admin'

		return this.metadataService.remove(id, actor)
	}
}
