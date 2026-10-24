import { Prisma } from '@repo/prisma'

const WRITE_KEYS = ['data', 'create', 'update'] as const

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' &&
	value !== null &&
	(Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null)

// Only plain objects are walked; Dates, Decimals and Buffers pass through untouched.
export const stripUndefined = (value: unknown): unknown => {
	if (Array.isArray(value)) return value.map(stripUndefined)

	if (!isPlainObject(value)) return value

	const result: Record<string, unknown> = {}

	for (const [key, entry] of Object.entries(value))
		if (entry !== undefined) result[key] = stripUndefined(entry)

	return result
}

// Removes undefined keys from write payloads so a partial update DTO never overwrites a column
// it did not mention, regardless of how the service built the data object.
export const omitUndefinedWrites = Prisma.defineExtension({
	name: 'omit-undefined-writes',
	query: {
		$allModels: {
			async $allOperations({ args, query }) {
				const writeArgs = args as Record<string, unknown>

				for (const key of WRITE_KEYS)
					if (writeArgs && key in writeArgs) writeArgs[key] = stripUndefined(writeArgs[key])

				return query(args)
			},
		},
	},
})
