import type { RequestMeta } from 'types/server'
import { Meta } from 'common/decorators/meta.decorator'
import type { AuthenticatedUser } from 'types/auth'

import { UserRole } from '@repo/prisma'
import { UserAdminService } from './user-admin.service'
import { QueryUserDto } from './dto/query-user.dto'
import { Roles } from 'common/decorators/roles.decorator'
import { CurrentUser } from 'common/decorators/current-user.decorator'
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { AdminCreateUserDto, AdminUpdateUserDto, UserResponseDto } from './user.dto'
import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Delete,
	Param,
	ParseUUIDPipe,
	Query,
	HttpCode,
	HttpStatus,
} from '@nestjs/common'

@ApiTags('User Management')
@ApiBearerAuth()
@Controller('users')
@Roles(UserRole.ADMIN)
export class UserController {
	constructor(private readonly users: UserAdminService) {}

	@Post()
	@ApiOperation({ summary: 'Create a new user (Admin / Super Admin)' })
	@ApiResponse({ status: 201, type: UserResponseDto })
	async create(
		@Body() createUserDto: AdminCreateUserDto,
		@Meta() meta: RequestMeta,
		@CurrentUser() currentUser: AuthenticatedUser,
	) {
		return this.users.adminCreate(createUserDto, meta, currentUser.id)
	}

	@Get()
	@ApiOperation({ summary: 'Get all users (Admin / Super Admin)' })
	@ApiResponse({ status: 200, type: [UserResponseDto] })
	async findAll(@Query() query: QueryUserDto) {
		return this.users.adminFindAll(query)
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get user by ID (Admin / Super Admin)' })
	@ApiResponse({ status: 200, type: UserResponseDto })
	async findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.users.findOne(id)
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Update a user (Admin / Super Admin)' })
	@ApiResponse({ status: 200, type: UserResponseDto })
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateUserDto: AdminUpdateUserDto,
		@Meta() meta: RequestMeta,
		@CurrentUser() currentUser: AuthenticatedUser,
	) {
		return this.users.adminUpdate(id, updateUserDto, meta, currentUser.id)
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({ summary: 'Delete a user (Admin / Super Admin)' })
	@ApiResponse({ status: 204 })
	async remove(
		@Param('id', ParseUUIDPipe) id: string,
		@CurrentUser() currentUser: AuthenticatedUser,
	): Promise<void> {
		await this.users.adminDelete(id, currentUser.id)
	}
}
