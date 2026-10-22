import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const src = fileURLToPath(new URL('./src', import.meta.url))

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: [
			{
				find: /^(actions|assets|components|constants|lib|validations)(\/.*)?$/,
				replacement: `${src}/$1$2`,
			},
		],
	},
	test: {
		coverage: {
			provider: 'v8',
			include: ['src/**/*.{ts,tsx}', 'app/**/*.{ts,tsx}'],
			exclude: ['**/*.test.{ts,tsx}', '**/*.d.ts'],
			reportsDirectory: 'coverage',
		},
		environment: 'jsdom',
		setupFiles: ['./test/setup.ts'],
		include: ['**/*.test.{ts,tsx}'],
		exclude: ['node_modules', '.next'],
		env: {
			NEXT_PUBLIC_BASE_URL: 'http://api.test',
			NEXT_PUBLIC_DEPLOY_URL: 'https://site.test',
			REVALIDATE_SECRET: 'test-secret',
		},
	},
})
