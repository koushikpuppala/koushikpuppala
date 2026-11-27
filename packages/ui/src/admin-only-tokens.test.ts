import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// The client compiles no CSS for these names, so a shared component using one would render unstyled there.
const ADMIN_ONLY = /(^|[\s'"`:])(text-small|text-headline)([\s'"`]|$)/

const sourceFiles = (dir: string): string[] =>
	readdirSync(dir).flatMap(name => {
		const path = join(dir, name)
		if (statSync(path).isDirectory()) return sourceFiles(path)
		return /\.(ts|tsx)$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : []
	})

describe('shared components', () => {
	it('use no admin only design token names', () => {
		const offenders = sourceFiles(__dirname).filter(file =>
			ADMIN_ONLY.test(readFileSync(file, 'utf8')),
		)

		expect(offenders).toEqual([])
	})
})
