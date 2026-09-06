import type { AuthenticatedUser } from 'types/express'

import { Request } from 'express'
import { UserRole } from '@repo/prisma'
import { UserService } from './user.service'
import { QueryUserDto } from './dto/query-user.dto'
import { Roles } from 'common/decorators/roles.decorator'
import { CurrentUser } from 'common/decorators/current-user.decorator'
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { AdminCreateUserDto, AdminUpdateUserDto, UserResponseDto } from './user.dto'
import { Controller, Get, Post, Body, Patch, Param, Req, Query } from '@nestjs/common'

@ApiTags('User Management')
@ApiBearerAuth()
@Controller('users')
@Roles(UserRole.ADMIN)
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	@ApiOperation({ summary: 'Create a new user (Admin / Super Admin)' })
	@ApiResponse({ status: 201, type: UserResponseDto })
	async create(
		@Body() createUserDto: AdminCreateUserDto,
		@Req() req: Request,
		@CurrentUser() currentUser: AuthenticatedUser,
	) {
		const meta = { requestId: req.requestId, endpoint: req.originalUrl }

		return this.userService.adminCreate(createUserDto, meta, currentUser.id)
	}

	@Get()
	@ApiOperation({ summary: 'Get all users (Admin / Super Admin)' })
	@ApiResponse({ status: 200, type: [UserResponseDto] })
	async findAll(@Query() query: QueryUserDto) {
		return this.userService.adminFindAll(query)
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get user by ID (Admin / Super Admin)' })
	@ApiResponse({ status: 200, type: UserResponseDto })
	async findOne(@Param('id') id: string) {
		return this.userService.findOne(id)
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Update a user (Admin / Super Admin)' })
	@ApiResponse({ status: 200, type: UserResponseDto })
	async update(
		@Param('id') id: string,
		@Body() updateUserDto: AdminUpdateUserDto,
		@Req() req: Request,
		@CurrentUser() currentUser: AuthenticatedUser,
	) {
		const meta = { requestId: req.requestId, endpoint: req.originalUrl }

		return this.userService.adminUpdate(id, updateUserDto, meta, currentUser.id)
	}
}
