import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

const root = join(__dirname, '../../..')
const biome = join(root, 'node_modules/.bin/biome')

const RAW = 'Use a design token instead of a raw color or an arbitrary size'
const SHADOW = 'Named shadows are not allowed'

// Biome runs custom plugins on files, not on stdin, so each case is a file in a throwaway project
// whose config applies the repo's rule files with the same include paths as the root biome.json.
const sandbox = mkdtempSync(join(tmpdir(), 'biome-tokens-'))
const TEST_FILES = ['!**/*.test.ts', '!**/*.test.tsx', '!**/*.d.ts']

beforeAll(() => {
	writeFileSync(
		join(sandbox, 'biome.json'),
		JSON.stringify({
			plugins: [
				{
					path: join(root, 'biome/no-raw-style-values.grit'),
					includes: ['apps/admin/**/*.tsx', 'packages/ui/src/**/*.tsx', ...TEST_FILES],
				},
				{
					path: join(root, 'biome/no-named-shadow.grit'),
					includes: ['apps/admin/**/*.tsx', ...TEST_FILES],
				},
			],
			files: { includes: ['**'] },
		}),
	)
})

afterAll(() => rmSync(sandbox, { recursive: true, force: true }))

const lint = (classes: string, path = 'apps/admin/src/fixture.tsx') => {
	const file = join(sandbox, path)
	mkdirSync(dirname(file), { recursive: true })
	writeFileSync(file, `export const Fixture = () => <div className='${classes}' />\n`)
	const run = spawnSync(biome, ['lint', path], { cwd: sandbox, encoding: 'utf8' })
	return `${run.stdout}${run.stderr}`
}

// covers: AC-8
describe('design token lint rules', () => {
	it.each([
		'text-[13px]',
		'bg-[#fff]',
		'border-[rgb(0,0,0)]',
		'md:p-[1.5rem]',
		'rounded-[0.7rem]',
		'max-w-[1440px]',
		'shadow-[0_0_20px_black]',
		'leading-[1.1]',
	])('flags the raw value %s', classes => {
		expect(lint(classes)).toContain(RAW)
	})

	it.each([
		'h-[85vh]',
		'w-[calc(100%-2rem)]',
		'min-h-[100dvh]',
		'shadow-[var(--shadow-signal)]',
		'bg-[color-mix(in_oklab,var(--signal)_10%,var(--surface))]',
		'text-body p-4 md:gap-6',
		'h-control-md max-w-page shadow-overlay shadow-none',
	])('allows %s', classes => {
		const output = lint(classes)

		expect(output).not.toContain(RAW)
		expect(output).not.toContain(SHADOW)
	})

	it.each(['shadow', 'shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-2xl', 'hover:shadow-xl'])(
		'flags the named shadow %s in the admin',
		classes => {
			expect(lint(classes)).toContain(SHADOW)
		},
	)

	it('leaves named shadows alone in the shared UI package, which the client also uses', () => {
		expect(lint('shadow-sm', 'packages/ui/src/fixture.tsx')).not.toContain(SHADOW)
	})

	it('still flags raw values in the shared UI package', () => {
		expect(lint('text-[13px]', 'packages/ui/src/fixture.tsx')).toContain(RAW)
	})

	it('ignores test files', () => {
		expect(lint('text-[13px]', 'apps/admin/src/fixture.test.tsx')).not.toContain(RAW)
	})
})
