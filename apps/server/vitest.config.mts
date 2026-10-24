import swc from 'unplugin-swc'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const plugins = [
	swc.vite({
		tsconfigFile: false,
		module: { type: 'es6' },
		jsc: {
			target: 'es2022',
			parser: { syntax: 'typescript', decorators: true },
			transform: { legacyDecorator: true, decoratorMetadata: true },
		},
	}),
]

const resolve = {
	alias: [
		{
			find: /^(common|config|database|firebase|modules|redis)(\/.*)?$/,
			replacement: `${fileURLToPath(new URL('./src', import.meta.url))}/$1$2`,
		},
	],
}

export default defineConfig({
	plugins,
	resolve,
	test: {
		coverage: {
			provider: 'v8',
			include: ['src/**/*.ts'],
			exclude: ['src/**/*.spec.ts', 'src/main.ts', 'src/instrument.ts'],
			reportsDirectory: 'coverage',
		},
		projects: [
			{
				test: { name: 'unit', environment: 'node', include: ['src/**/*.spec.ts'] },
			},
			{
				test: {
					name: 'e2e',
					environment: 'node',
					include: ['test/**/*.e2e-spec.ts'],
					globalSetup: ['./test/global-setup.ts'],
					setupFiles: ['./test/setup.ts'],
					fileParallelism: false,
					testTimeout: 30_000,
					hookTimeout: 60_000,
				},
			},
		],
	},
})
