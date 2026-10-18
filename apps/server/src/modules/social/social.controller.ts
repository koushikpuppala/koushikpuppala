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
import { SocialService } from './social.service'
import { Roles } from 'common/decorators/roles.decorator'
import { Public } from 'common/decorators/public.decorator'
import { ApiEndpoint } from 'common/decorators/swagger.decorator'
import { CreateSocialDto, QuerySocialDto, UpdateSocialDto } from './social.dto'
import { RevalidateTags } from 'common/decorators/revalidate.decorator'

@ApiTags('Social')
@RevalidateTags('socials')
@Controller('socials')
export class SocialController {
	constructor(private readonly socialService: SocialService) {}

	@Public()
	@Get('visible')
	@ApiEndpoint({
		summary: 'Get all visible social profile links (Public)',
		method: 'GET',
		auth: false,
		isArray: true,
		endpoint: 'GET /api/v1/socials/visible',
	})
	async getVisible() {
		return this.socialService.getVisible()
	}

	@Get()
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'List all social links (Admin)',
		method: 'GET',
		isPaginated: true,
		endpoint: 'GET /api/v1/socials',
	})
	async findAll(@Query() query: QuerySocialDto) {
		return this.socialService.adminFindAll(query)
	}

	@Get(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Get social link by ID (Admin)',
		method: 'GET',
		endpoint: 'GET /api/v1/socials/:id',
	})
	async findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.socialService.findOne(id)
	}

	@Post()
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Create social link (Admin)',
		method: 'POST',
		endpoint: 'POST /api/v1/socials',
	})
	async create(@Body() dto: CreateSocialDto, @Actor() actor: string) {
		return this.socialService.create(dto, actor)
	}

	@Patch(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Update social link (Admin)',
		method: 'PATCH',
		endpoint: 'PATCH /api/v1/socials/:id',
	})
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() dto: UpdateSocialDto,
		@Actor() actor: string,
	) {
		return this.socialService.update(id, dto, actor)
	}

	@Delete(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Soft-delete social link (Admin)',
		method: 'DELETE',
		endpoint: 'DELETE /api/v1/socials/:id',
	})
	async remove(@Param('id', ParseUUIDPipe) id: string, @Actor() actor: string) {
		return this.socialService.remove(id, actor)
	}
}
