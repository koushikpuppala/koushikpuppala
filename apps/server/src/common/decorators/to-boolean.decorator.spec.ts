import 'reflect-metadata'
import { IsBoolean, IsOptional, validateSync } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { describe, expect, it } from 'vitest'
import { ToBoolean } from './to-boolean.decorator'

class Query {
	@ToBoolean()
	@IsBoolean()
	@IsOptional()
	isPublished?: boolean
}

const parse = (input: Record<string, unknown>) =>
	plainToInstance(Query, input, { enableImplicitConversion: true })

describe('ToBoolean', () => {
	it('reads "false" as false, not as a truthy string', () => {
		expect(parse({ isPublished: 'false' }).isPublished).toBe(false)
		expect(parse({ isPublished: 'true' }).isPublished).toBe(true)
	})

	it('leaves a missing value unset', () => {
		expect(parse({}).isPublished).toBeUndefined()
	})

	it('lets validation reject anything else', () => {
		expect(validateSync(parse({ isPublished: 'maybe' }))).toHaveLength(1)
	})
})
