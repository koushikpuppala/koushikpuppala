import { NotFoundException } from '@nestjs/common'

export abstract class BaseCmsService {
	protected ensureExists<T>(entity: T | null, message = 'Resource not found'): T {
		if (!entity) throw new NotFoundException(message)

		return entity
	}

	protected getPagination(page = 1, limit = 10) {
		const currentPage = Math.max(Number(page), 1)
		const currentLimit = Math.max(Number(limit), 1)

		return {
			page: currentPage,
			take: currentLimit,
			limit: currentLimit,
			skip: (currentPage - 1) * currentLimit,
		}
	}

	protected getPaginationMeta(page: number, limit: number, total: number) {
		return { page, limit, total, totalPages: Math.ceil(total / limit) }
	}
}
