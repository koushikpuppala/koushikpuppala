import type { Prisma, User } from '@repo/prisma'
import type { ApiResponse, PaginatedList, UserListCounts, UserRecord } from 'types/api'
import type { CodedError, RequestMeta } from 'types/server'

import { DatabaseService } from 'database'
import { QueryUserDto } from './dto/query-user.dto'
import { withPrismaRetry } from 'database/prisma-retry'
import { FirebaseService } from 'firebase/firebase.service'
import { createdAtRange } from 'common/utils/date-range.util'
import { AdminCreateUserDto, AdminUpdateUserDto } from './user.dto'
import { AuditLogService } from 'modules/audit-log/audit-log.service'
import { successResponse } from 'common/interfaces/api-response.interface'
import { LoggerService, requestFields } from 'common/logger/logger.service'
import { AuditAction, AuthProvider, UserRole, UserStatus } from '@repo/prisma'
import { splitName, toUserRecord } from './user.mapper'
import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'

@Injectable()
export class UserAdminService {
	constructor(
		private readonly prisma: DatabaseService,
		private readonly logger: LoggerService,
		private readonly firebase: FirebaseService,
		private readonly auditLog: AuditLogService,
	) {}

	async adminFindAll(query: QueryUserDto): Promise<PaginatedList<UserRecord> & UserListCounts> {
		const { page, limit, search, role, status, from, to, sortBy, sortOrder } = query

		const where: Prisma.UserWhereInput = {}

		if (role) where.role = role
		if (status) where.status = status

		const createdAt = createdAtRange(from, to)
		if (createdAt) where.createdAt = createdAt

		const keyword = search?.trim()

		if (keyword)
			where.OR = [
				{ email: { contains: keyword, mode: 'insensitive' } },
				{ displayName: { contains: keyword, mode: 'insensitive' } },
			]

		// The role and status counts ignore the filters: they summarise all users for the page header.
		const [users, total, adminCount, editorCount, activeCount] = await this.prisma.$transaction([
			this.prisma.user.findMany({
				where,
				skip: (page - 1) * limit,
				take: limit,
				orderBy: [{ [sortBy]: sortOrder }, { id: 'asc' }],
			}),
			this.prisma.user.count({ where }),
			this.prisma.user.count({ where: { role: UserRole.ADMIN } }),
			this.prisma.user.count({ where: { role: UserRole.EDITOR } }),
			this.prisma.user.count({ where: { status: UserStatus.ACTIVE } }),
		])

		return {
			items: users.map(toUserRecord),
			adminCount,
			editorCount,
			activeCount,
			pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
		}
	}

	async findOne(id: string): Promise<ApiResponse<UserRecord>> {
		const user = await this.findByIdOrThrow(id)

		return successResponse(toUserRecord(user), 'User retrieved successfully.')
	}

	async adminCreate(
		dto: AdminCreateUserDto,
		meta?: RequestMeta,
		actorId?: string,
	): Promise<ApiResponse<UserRecord>> {
		this.logger.info('Admin user creation started', UserAdminService.name, {
			...requestFields(meta),
			email: dto.email,
		})

		if (dto.password !== (dto.confirmPassword ?? dto.password))
			throw new BadRequestException('Passwords do not match')

		const email = dto.email.trim()

		const existing = await this.prisma.user.findFirst({
			where: { email: { equals: email, mode: 'insensitive' } },
		})

		if (existing) throw new ConflictException('A user with this email already exists')

		const firebaseUser = await this.firebaseCall('Failed to create user in Firebase', () =>
			this.firebase.createUser({
				email,
				password: dto.password,
				displayName: dto.fullName.trim(),
				phoneNumber: dto.phoneNumber?.trim() || undefined,
				emailVerified: true,
			}),
		)

		// Firebase and PostgreSQL cannot share a transaction: if the database insert fails,
		// delete the Firebase account so the two stores do not drift apart.
		try {
			const user = await withPrismaRetry(() =>
				this.prisma.user.create({
					data: {
						firebaseUid: firebaseUser.uid,
						email,
						displayName: dto.fullName.trim(),
						...splitName(dto.fullName),
						provider: AuthProvider.PASSWORD,
						role: dto.role,
						status: dto.status ?? UserStatus.ACTIVE,
						emailVerified: true,
					},
				}),
			)

			await this.auditLog.log({
				action: AuditAction.CREATE,
				entity: 'User',
				entityId: user.id,
				newData: user,
				actorId,
			})

			return successResponse(toUserRecord(user), 'User created successfully.')
		} catch (error) {
			await this.firebase.deleteUser(firebaseUser.uid)

			throw error
		}
	}

	async adminUpdate(
		id: string,
		dto: AdminUpdateUserDto,
		meta?: RequestMeta,
		actorId?: string,
	): Promise<ApiResponse<UserRecord>> {
		const user = await this.findByIdOrThrow(id)

		this.logger.info('Admin user update started', UserAdminService.name, {
			...requestFields(meta),
			userId: user.id,
		})

		// Losing the admin role or active status both count as removing an administrator.
		const demotes =
			(dto.role !== undefined && dto.role !== UserRole.ADMIN) ||
			(dto.status !== undefined && dto.status !== UserStatus.ACTIVE)

		if (actorId && id === actorId) {
			if (dto.role && dto.role !== UserRole.ADMIN)
				throw new BadRequestException('Administrators cannot demote their own account')

			if (dto.status && dto.status !== UserStatus.ACTIVE)
				throw new BadRequestException('Administrators cannot deactivate their own account')
		}

		if (user.role === UserRole.ADMIN && demotes)
			await this.assertAnotherActiveAdmin(
				id,
				'Cannot demote or deactivate the last remaining active administrator',
			)

		const fullName = dto.fullName?.trim()

		const data: Prisma.UserUpdateInput = {
			...(fullName && { displayName: fullName, ...splitName(fullName) }),
			...(dto.role && { role: dto.role }),
			...(dto.status && { status: dto.status }),
		}

		const firebaseUpdate = {
			...(fullName && { displayName: fullName }),
			...(dto.phoneNumber !== undefined && { phoneNumber: dto.phoneNumber?.trim() || null }),
			...(dto.password && { password: dto.password }),
		}

		if (Object.keys(firebaseUpdate).length > 0)
			await this.firebaseCall('Failed to update user in Firebase', () =>
				this.firebase.updateUser(user.firebaseUid, firebaseUpdate),
			)

		const updatedUser = await withPrismaRetry(() =>
			this.prisma.user.update({ where: { id }, data }),
		)

		await this.auditLog.log({
			action: AuditAction.UPDATE,
			entity: 'User',
			entityId: id,
			oldData: user,
			newData: updatedUser,
			actorId,
		})

		return successResponse(toUserRecord(updatedUser), 'User updated successfully.')
	}

	async adminDelete(id: string, actorId?: string): Promise<User> {
		if (actorId && id === actorId)
			throw new BadRequestException('Administrators cannot delete their own account')

		const user = await this.findByIdOrThrow(id)

		if (user.role === UserRole.ADMIN)
			await this.assertAnotherActiveAdmin(
				id,
				'Cannot delete the last remaining active administrator',
			)

		try {
			await this.firebase.deleteUser(user.firebaseUid)
		} catch (error) {
			const err = error as CodedError
			// The account may already be gone from Firebase; still remove the database row.
			if (err?.code !== 'auth/user-not-found')
				throw new BadRequestException(err?.message || 'Failed to delete user in Firebase')
		}

		const deleted = await withPrismaRetry(() => this.prisma.user.delete({ where: { id } }))

		await this.auditLog.log({
			action: AuditAction.DELETE,
			entity: 'User',
			entityId: id,
			oldData: user,
			actorId,
		})

		return deleted
	}

	private async findByIdOrThrow(id: string): Promise<User> {
		const user = await this.prisma.user.findUnique({ where: { id } })

		if (!user) throw new NotFoundException('User not found')

		return user
	}

	// Guards against locking everyone out of the CMS by removing the last active admin.
	private async assertAnotherActiveAdmin(id: string, message: string): Promise<void> {
		const others = await this.prisma.user.count({
			where: { role: UserRole.ADMIN, status: UserStatus.ACTIVE, id: { not: id } },
		})

		if (others === 0) throw new BadRequestException(message)
	}

	private async firebaseCall<T>(fallback: string, call: () => Promise<T>): Promise<T> {
		try {
			return await call()
		} catch (error) {
			throw new BadRequestException((error as Error)?.message || fallback)
		}
	}
}
