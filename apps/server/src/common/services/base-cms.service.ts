import type { SortOrder } from 'types/api'
import type { OrderByList } from 'types/server'

import { BadRequestException, NotFoundException } from '@nestjs/common'

export abstract class BaseService {
	protected ensureExists<T>(entity: T | null, message = 'Resource not found'): T {
		if (!entity) throw new NotFoundException(message)

		return entity
	}

	protected assertDateRange(
		startDate: Date | string | null | undefined,
		endDate: Date | string | null | undefined,
	): void {
		if (!startDate || !endDate) return

		if (new Date(endDate).getTime() < new Date(startDate).getTime())
			throw new BadRequestException('End date cannot be before the start date.')
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

	protected getOrderBy<F extends string, G extends string>(
		sortBy: F | undefined,
		sortOrder: SortOrder | undefined,
		fallback: OrderByList<G>,
	): OrderByList<F | G | 'id'> {
		if (!sortBy) return fallback as OrderByList<F | G | 'id'>

		// id is a tie-breaker so rows with equal sort values keep a stable order across pages.
		return [{ [sortBy]: sortOrder ?? 'asc' }, { id: 'asc' }] as OrderByList<F | G | 'id'>
	}
}
