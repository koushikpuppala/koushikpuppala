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
import { SkillService } from './skill.service'
import { Roles } from 'common/decorators/roles.decorator'
import { Public } from 'common/decorators/public.decorator'
import { ApiEndpoint } from 'common/decorators/swagger.decorator'
import { CreateSkillDto, QuerySkillDto, UpdateSkillDto } from './skill.dto'
import { RevalidateTags } from 'common/decorators/revalidate.decorator'

@ApiTags('Skills')
@RevalidateTags('skills')
@Controller('skills')
export class SkillController {
	constructor(private readonly skillService: SkillService) {}

	@Public()
	@Get('published')
	@ApiEndpoint({
		summary: 'Get all published skills (Public)',
		method: 'GET',
		auth: false,
		isArray: true,
		endpoint: 'GET /api/v1/skills/published',
	})
	async getPublished(@Query('category') category?: string) {
		return this.skillService.getPublished(category)
	}

	@Get()
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'List all skills (Admin)',
		method: 'GET',
		isPaginated: true,
		endpoint: 'GET /api/v1/skills',
	})
	async findAll(@Query() query: QuerySkillDto) {
		return this.skillService.adminFindAll(query)
	}

	@Get(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Get skill by ID (Admin)',
		method: 'GET',
		endpoint: 'GET /api/v1/skills/:id',
	})
	async findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.skillService.findOne(id)
	}

	@Post()
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Create skill (Admin)',
		method: 'POST',
		endpoint: 'POST /api/v1/skills',
	})
	async create(@Body() dto: CreateSkillDto, @Actor() actor: string) {
		return this.skillService.create(dto, actor)
	}

	@Patch(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Update skill (Admin)',
		method: 'PATCH',
		endpoint: 'PATCH /api/v1/skills/:id',
	})
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() dto: UpdateSkillDto,
		@Actor() actor: string,
	) {
		return this.skillService.update(id, dto, actor)
	}

	@Patch(':id/publish')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Toggle publish status of skill (Admin)',
		method: 'PATCH',
		endpoint: 'PATCH /api/v1/skills/:id/publish',
	})
	async togglePublish(@Param('id', ParseUUIDPipe) id: string, @Actor() actor: string) {
		return this.skillService.togglePublish(id, actor)
	}

	@Delete(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Soft-delete skill (Admin)',
		method: 'DELETE',
		endpoint: 'DELETE /api/v1/skills/:id',
	})
	async remove(@Param('id', ParseUUIDPipe) id: string, @Actor() actor: string) {
		return this.skillService.remove(id, actor)
	}
}
