import { Test, TestingModule } from '@nestjs/testing'
import { ContactService } from './contact.service'
import { DatabaseService } from 'database'
import { AuditLogService } from 'modules/audit-log/audit-log.service'
import { ContactPriority, ContactStatus } from '@repo/prisma'
import { NotFoundException } from '@nestjs/common'

describe('ContactService', () => {
	let service: ContactService
	let prisma: jest.Mocked<DatabaseService>
	let auditLog: jest.Mocked<AuditLogService>

	const mockContact = {
		id: 'contact-1',
		name: 'John Doe',
		email: 'john@example.com',
		subject: 'Collaboration',
		message: 'Interested in working together',
		url: null,
		source: 'website',
		status: ContactStatus.UNREAD,
		priority: ContactPriority.NORMAL,
		internalNotes: null,
		assignedToId: null,
		readAt: null,
		resolvedAt: null,
		ipAddress: '127.0.0.1',
		userAgent: 'Jest',
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null,
		assignedTo: null,
	}

	beforeEach(async () => {
		prisma = {
			contact: {
				create: jest.fn(),
				findFirst: jest.fn(),
				findMany: jest.fn(),
				count: jest.fn(),
				update: jest.fn(),
			},
		} as unknown as jest.Mocked<DatabaseService>

		auditLog = {
			create: jest.fn().mockResolvedValue(undefined),
			log: jest.fn().mockResolvedValue(undefined),
		} as unknown as jest.Mocked<AuditLogService>

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ContactService,
				{ provide: DatabaseService, useValue: prisma },
				{ provide: AuditLogService, useValue: auditLog },
			],
		}).compile()

		service = module.get<ContactService>(ContactService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})

	describe('submit', () => {
		it('should create new contact message with UNREAD status', async () => {
			;(prisma.contact.create as jest.Mock).mockResolvedValue(mockContact)

			const result = await service.submit(
				{
					name: 'John Doe',
					email: 'john@example.com',
					subject: 'Collaboration',
					message: 'Interested in working together',
				},
				'127.0.0.1',
				'Jest',
			)

			expect(result.id).toBe('contact-1')
			expect(prisma.contact.create).toHaveBeenCalledWith(
				expect.objectContaining({
					data: expect.objectContaining({
						status: ContactStatus.UNREAD,
						priority: ContactPriority.NORMAL,
					}),
				}),
			)
		})

		it('should flag automated submissions with honeypot url filled as SPAM', async () => {
			;(prisma.contact.create as jest.Mock).mockResolvedValue({
				...mockContact,
				status: ContactStatus.SPAM,
				priority: ContactPriority.LOW,
			})

			await service.submit(
				{
					name: 'Bot',
					email: 'bot@spam.com',
					subject: 'Spam Subject',
					message: 'Spam content message body',
					url: 'https://spam-link.com',
				},
				'127.0.0.1',
				'BotAgent',
			)

			expect(prisma.contact.create).toHaveBeenCalledWith(
				expect.objectContaining({
					data: expect.objectContaining({
						status: ContactStatus.SPAM,
						priority: ContactPriority.LOW,
					}),
				}),
			)
		})
	})

	describe('findOne', () => {
		it('should mark unread message as read on retrieval', async () => {
			;(prisma.contact.findFirst as jest.Mock).mockResolvedValue({ ...mockContact })
			;(prisma.contact.update as jest.Mock).mockResolvedValue({
				...mockContact,
				status: ContactStatus.READ,
			})

			const result = await service.findOne('contact-1')
			expect(result.status).toBe(ContactStatus.READ)
			expect(prisma.contact.update).toHaveBeenCalledWith(
				expect.objectContaining({
					where: { id: 'contact-1' },
					data: expect.objectContaining({ status: ContactStatus.READ }),
				}),
			)
		})

		it('should throw NotFoundException if not found', async () => {
			;(prisma.contact.findFirst as jest.Mock).mockResolvedValue(null)

			await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException)
		})
	})

	describe('update', () => {
		it('should update status and record audit log', async () => {
			;(prisma.contact.findFirst as jest.Mock).mockResolvedValue({
				...mockContact,
				status: ContactStatus.READ,
			})
			;(prisma.contact.update as jest.Mock).mockResolvedValue({
				...mockContact,
				status: ContactStatus.RESOLVED,
			})

			const result = await service.update('contact-1', {
				status: ContactStatus.RESOLVED,
			})

			expect(result.status).toBe(ContactStatus.RESOLVED)
			expect(auditLog.create).toHaveBeenCalled()
		})
	})
})
