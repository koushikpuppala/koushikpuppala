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
import {
	CompleteMediaUploadDto,
	QueryMediaDto,
	RequestPresignedUploadDto,
	UpdateMediaDto,
} from './media.dto'
import { UserRole } from '@repo/prisma'
import { ApiTags } from '@nestjs/swagger'
import { Actor } from 'common/decorators/actor.decorator'
import { CurrentUser } from 'common/decorators/current-user.decorator'
import { MediaService } from './media.service'
import { Roles } from 'common/decorators/roles.decorator'
import { ApiEndpoint } from 'common/decorators/swagger.decorator'
import { RevalidateTags } from 'common/decorators/revalidate.decorator'

@ApiTags('Media')
@RevalidateTags(
	'home',
	'about',
	'experience',
	'education',
	'projects',
	'skills',
	'services',
	'resume',
	'socials',
	'metadata',
)
@Controller('media')
export class MediaController {
	constructor(private readonly mediaService: MediaService) {}

	@Post('presigned-url')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Generate AWS S3 presigned PUT URL for direct client upload (Admin)',
		method: 'POST',
		endpoint: 'POST /api/v1/media/presigned-url',
	})
	async requestPresignedUpload(@Body() dto: RequestPresignedUploadDto) {
		return this.mediaService.requestPresignedUpload(dto)
	}

	@Post('complete')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Register completed upload metadata into database (Admin)',
		method: 'POST',
		endpoint: 'POST /api/v1/media/complete',
	})
	async completeUpload(
		@Body() dto: CompleteMediaUploadDto,
		@CurrentUser('id') userId: string | undefined,
		@Actor() actor: string,
	) {
		return this.mediaService.completeUpload(dto, userId, actor)
	}

	@Get()
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'List all media files (Admin)',
		method: 'GET',
		isPaginated: true,
		endpoint: 'GET /api/v1/media',
	})
	async findAll(@Query() query: QueryMediaDto) {
		return this.mediaService.adminFindAll(query)
	}

	@Get(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Get media file metadata by ID (Admin)',
		method: 'GET',
		endpoint: 'GET /api/v1/media/:id',
	})
	async findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.mediaService.findOne(id)
	}

	@Patch(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Update media altText and caption metadata (Admin)',
		method: 'PATCH',
		endpoint: 'PATCH /api/v1/media/:id',
	})
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() dto: UpdateMediaDto,
		@Actor() actor: string,
	) {
		return this.mediaService.update(id, dto, actor)
	}

	@Delete(':id')
	@Roles(UserRole.EDITOR)
	@ApiEndpoint({
		summary: 'Delete media file from storage and database (Admin)',
		method: 'DELETE',
		endpoint: 'DELETE /api/v1/media/:id',
	})
	async remove(@Param('id', ParseUUIDPipe) id: string, @Actor() actor: string) {
		return this.mediaService.remove(id, actor)
	}
}
