import type { Prisma, User } from '@repo/prisma'
import type { AuthenticatedUser } from 'types/express'

import {
	ConflictException,
	Injectable,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common'
import { DatabaseService } from 'database'
import { UserRecord } from 'firebase-admin/auth'
import { QueryUserDto } from './dto/query-user.dto'
import { UserRole, UserStatus } from '@repo/prisma'
import { withPrismaRetry } from 'database/prisma-retry'
import { AuthProvider, AuditAction } from '@repo/prisma'
import { FirebaseService } from 'firebase/firebase.service'
import { LoggerService } from 'common/logger/logger.service'
import { AdminCreateUserDto, AdminUpdateUserDto } from './user.dto'
import { AuditLogService } from 'modules/audit-log/audit-log.service'
import { ApiResponse, successResponse } from 'common/interfaces/api-response.interface'

@Injectable()
export class UserService {
	constructor(
		private readonly prisma: DatabaseService,
		private readonly logger: LoggerService,
		private readonly firebase: FirebaseService,
		private readonly auditLog: AuditLogService,
	) {}

	async create(data: Prisma.UserCreateInput): Promise<User> {
		const existingUser = await this.prisma.user.findUnique({
			where: { firebaseUid: data.firebaseUid, email: data.email },
		})

		if (existingUser) throw new ConflictException('User already exists')

		return this.prisma.user.create({ data })
	}

	async adminFindAll(query: QueryUserDto): Promise<
		ApiResponse<
			Array<{
				id: string
				email: string
				name: string
				role: UserRole
				status: UserStatus
				createdAt: Date
			}>
		>
	> {
		const { page, limit, search, role, status, sortBy, sortOrder } = query

		const skip = (page - 1) * limit

		const where: Prisma.UserWhereInput = {}

		if (role) where.role = role
		if (status) where.status = status

		const keyword = search?.trim()

		if (keyword)
			where.OR = [
				{ email: { contains: keyword, mode: 'insensitive' } },
				{ displayName: { contains: keyword, mode: 'insensitive' } },
			]

		const [users, total] = await this.prisma.$transaction([
			this.prisma.user.findMany({
				where,
				skip,
				take: limit,
				orderBy: { [sortBy]: sortOrder },
			}),
			this.prisma.user.count({ where }),
		])

		const mapped = users.map(user => ({
			id: user.id,
			email: user.email,
			name: user.displayName,
			role: user.role,
			status: user.status,
			createdAt: user.createdAt,
		}))

		return successResponse(mapped, 'Users fetched successfully.', total)
	}

	async findAll(query?: Prisma.UserFindManyArgs): Promise<User[]> {
		return this.prisma.user.findMany(query)
	}

	private async findByIdOrThrow(id: string): Promise<User> {
		const user = await this.prisma.user.findUnique({ where: { id } })
		if (!user) throw new NotFoundException('User not found')
		return user
	}

	async findOne(id: string): Promise<
		ApiResponse<{
			id: string
			email: string
			name: string
			role: UserRole
			status: UserStatus
			createdAt: Date
		}>
	> {
		const user = await this.findByIdOrThrow(id)

		return successResponse(
			{
				id: user.id,
				email: user.email,
				name: user.displayName,
				role: user.role,
				status: user.status,
				createdAt: user.createdAt,
			},
			'User retrieved successfully.',
		)
	}

	async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
		await this.findOne(id)

		return this.prisma.user.update({ where: { id }, data })
	}

	async remove(id: string): Promise<User> {
		await this.findOne(id)

		return this.prisma.user.delete({ where: { id } })
	}

	async findByFirebaseUid(
		firebaseUid: string,
		meta?: { requestId: string; endpoint: string },
	): Promise<User | null> {
		const start = Date.now()
		const reqId = meta?.requestId || 'unknown'
		const endpoint = meta?.endpoint || 'unknown'

		this.logger.info('User lookup started', UserService.name, {
			requestId: reqId,
			endpoint,
			firebaseUid,
		})

		try {
			const user = await this.prisma.user.findUnique({ where: { firebaseUid } })

			this.logger.info('User lookup completed', UserService.name, {
				requestId: reqId,
				endpoint,
				firebaseUid,
				userId: user?.id,
				duration: Date.now() - start,
			})

			return user
		} catch (error) {
			this.logger.error(
				'Prisma user lookup error',
				UserService.name,
				error instanceof Error ? error : new Error(String(error)),
				{
					requestId: reqId,
					endpoint,
					firebaseUid,
					duration: Date.now() - start,
				},
			)
			throw error
		}
	}

	toAuthenticatedUser(user: User): AuthenticatedUser {
		return {
			id: user.id,
			role: user.role,
			email: user.email,
			status: user.status,
			provider: user.provider,
			firebaseUid: user.firebaseUid,
			emailVerified: user.emailVerified,
			photoUrl: user.photoUrl ?? undefined,
			displayName: user.displayName ?? undefined,
		}
	}

	private splitName(name?: string) {
		if (!name) return { firstName: '', lastName: '' }

		const parts = name.trim().split(/\s+/)

		return { firstName: parts[0] ?? '', lastName: parts.slice(1).join(' ') }
	}

	private async createFirebaseUser(
		user: AuthenticatedUser,
		meta?: { requestId: string; endpoint: string },
	) {
		const start = Date.now()
		const reqId = meta?.requestId || 'unknown'
		const endpoint = meta?.endpoint || 'unknown'

		this.logger.info('User creation started', UserService.name, {
			requestId: reqId,
			endpoint,
			firebaseUid: user.firebaseUid,
		})

		try {
			const { firstName, lastName } = this.splitName(user.displayName)

			const newUser = await this.prisma.user.create({
				data: {
					lastName,
					firstName,
					email: user.email,
					provider: user.provider,
					lastLoginAt: new Date(),
					photoUrl: user.photoUrl ?? '',
					firebaseUid: user.firebaseUid,
					role: user.role ?? UserRole.USER,
					emailVerified: user.emailVerified,
					displayName: user.displayName ?? '',
					status: user.status ?? UserStatus.ACTIVE,
				},
			})

			this.logger.info('User creation completed', UserService.name, {
				requestId: reqId,
				endpoint,
				firebaseUid: user.firebaseUid,
				userId: newUser.id,
				duration: Date.now() - start,
			})

			return newUser
		} catch (error) {
			if (
				error &&
				typeof error === 'object' &&
				'code' in error &&
				(error as { code: string }).code === 'P2002'
			) {
				this.logger.warn(
					'Concurrent user creation detected (P2002), falling back to user update',
					UserService.name,
					{ requestId: reqId, firebaseUid: user.firebaseUid },
				)

				const existing = await this.findByFirebaseUid(user.firebaseUid, meta)

				if (existing) return this.updateFirebaseUser(existing, user, meta)
			}

			this.logger.error(
				'Prisma user creation error',
				UserService.name,
				error instanceof Error ? error : new Error(String(error)),
				{
					requestId: reqId,
					endpoint,
					firebaseUid: user.firebaseUid,
					duration: Date.now() - start,
				},
			)
			throw error
		}
	}

	private async updateFirebaseUser(
		existing: User,
		user: AuthenticatedUser,
		meta?: { requestId: string; endpoint: string },
	) {
		const start = Date.now()
		const reqId = meta?.requestId || 'unknown'
		const endpoint = meta?.endpoint || 'unknown'

		try {
			const { firstName, lastName } = this.splitName(user.displayName)

			const updatedUser = await this.prisma.user.update({
				where: { id: existing.id },
				data: {
					lastName,
					firstName,
					photoUrl: user.photoUrl ?? null,
					provider: user.provider,
					lastLoginAt: new Date(),
					version: { increment: 1 },
					displayName: user.displayName ?? '',
					emailVerified: user.emailVerified,
				},
			})

			return updatedUser
		} catch (error) {
			this.logger.error(
				'Prisma user update error',
				UserService.name,
				error instanceof Error ? error : new Error(String(error)),
				{
					requestId: reqId,
					endpoint,
					firebaseUid: user.firebaseUid,
					userId: existing.id,
					duration: Date.now() - start,
				},
			)
			throw error
		}
	}

	async syncFirebaseUser(user: AuthenticatedUser, meta?: { requestId: string; endpoint: string }) {
		const existing = await this.findByFirebaseUid(user.firebaseUid, meta)

		const dbUser = !existing
			? await this.createFirebaseUser(user, meta)
			: await this.updateFirebaseUser(existing, user, meta)

		await this.auditLog.log({
			action: AuditAction.LOGIN,
			entity: 'User',
			entityId: dbUser.id,
			actorId: dbUser.id,
			actorName: dbUser.displayName || dbUser.email,
			requestId: meta?.requestId,
		})

		return this.toAuthenticatedUser(dbUser)
	}

	async adminCreate(
		dto: AdminCreateUserDto,
		meta?: { requestId: string; endpoint: string },
		actorId?: string,
	) {
		const reqId = meta?.requestId || 'unknown'
		const endpoint = meta?.endpoint || 'unknown'

		this.logger.info('Admin user creation started', UserService.name, {
			requestId: reqId,
			endpoint,
			email: dto.email,
		})

		const confirmPassword = dto.confirmPassword ?? dto.password

		if (dto.password !== confirmPassword) throw new BadRequestException('Passwords do not match')

		const existing = await this.prisma.user.findFirst({
			where: { email: { equals: dto.email.trim(), mode: 'insensitive' } },
		})

		if (existing) throw new ConflictException('A user with this email already exists')

		let firebaseUser: UserRecord

		try {
			firebaseUser = await this.firebase.createUser({
				email: dto.email.trim(),
				password: dto.password,
				displayName: dto.fullName.trim(),
				phoneNumber: dto.phoneNumber?.trim() || undefined,
				emailVerified: true,
			})
		} catch (error) {
			throw new BadRequestException(
				(error as Error)?.message || 'Failed to create user in Firebase',
			)
		}

		try {
			const { firstName, lastName } = this.splitName(dto.fullName)
			const user = await withPrismaRetry(() =>
				this.prisma.user.create({
					data: {
						firebaseUid: firebaseUser.uid,
						email: dto.email.trim(),
						displayName: dto.fullName.trim(),
						firstName,
						lastName,
						provider: AuthProvider.PASSWORD,
						role: dto.role,
						status: dto.status ?? UserStatus.ACTIVE,
						emailVerified: true,
						createdBy: actorId || null,
						updatedBy: actorId || null,
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

			return successResponse(
				{
					id: user.id,
					email: user.email,
					name: user.displayName,
					role: user.role,
					status: user.status,
					createdAt: user.createdAt,
				},
				'User created successfully.',
			)
		} catch (error) {
			await this.firebase.deleteUser(firebaseUser.uid)

			throw error
		}
	}

	async adminUpdate(
		id: string,
		dto: AdminUpdateUserDto,
		meta?: { requestId: string; endpoint: string },
		actorId?: string,
	): Promise<
		ApiResponse<{
			id: string
			email: string
			name: string
			role: UserRole
			status: UserStatus
			createdAt: Date
		}>
	> {
		const reqId = meta?.requestId || 'unknown'
		const endpoint = meta?.endpoint || 'unknown'
		const user = await this.findByIdOrThrow(id)

		this.logger.info('Admin user update started', UserService.name, {
			requestId: reqId,
			endpoint,
			userId: user.id,
		})

		const data: Prisma.UserUpdateInput = {
			version: { increment: 1 },
			...(actorId && { updatedBy: actorId }),
		}

		if (dto.fullName) {
			const { firstName, lastName } = this.splitName(dto.fullName)
			data.displayName = dto.fullName.trim()
			data.firstName = firstName
			data.lastName = lastName
		}

		if (dto.role) data.role = dto.role

		if (dto.status) data.status = dto.status

		const firebaseUpdate: Record<string, unknown> = {}

		if (dto.fullName) firebaseUpdate.displayName = dto.fullName.trim()
		if (dto.phoneNumber !== undefined) firebaseUpdate.phoneNumber = dto.phoneNumber?.trim() || null
		if (dto.password) firebaseUpdate.password = dto.password

		if (Object.keys(firebaseUpdate).length > 0)
			try {
				await this.firebase.updateUser(user.firebaseUid, firebaseUpdate)
			} catch (error) {
				throw new BadRequestException(
					(error as Error)?.message || 'Failed to update user in Firebase',
				)
			}

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

		return successResponse(
			{
				id: updatedUser.id,
				email: updatedUser.email,
				name: updatedUser.displayName,
				role: updatedUser.role,
				status: updatedUser.status,
				createdAt: updatedUser.createdAt,
			},
			'User updated successfully.',
		)
	}

	async adminDelete(id: string, actorId?: string) {
		const user = await this.findByIdOrThrow(id)

		try {
			await this.firebase.deleteUser(user.firebaseUid)
		} catch (error) {
			const err = error as { code?: string; message?: string }
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
}
