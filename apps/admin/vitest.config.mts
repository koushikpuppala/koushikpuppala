import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const src = fileURLToPath(new URL('./src', import.meta.url))

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: [
			{
				find: /^(actions|components|constants|lib|styles|validations)(\/.*)?$/,
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
		// Interaction tests drive whole forms through jsdom. On a slow or busy machine they can take several times
		// longer than here, and a timed out test keeps typing into the next one, so the limit leaves headroom.
		testTimeout: 20_000,
		setupFiles: ['./test/setup.ts'],
		include: ['**/*.test.{ts,tsx}'],
		exclude: ['node_modules', '.next'],
		env: { NEXT_PUBLIC_BASE_URL: 'http://api.test', NEXT_PUBLIC_DEPLOY_URL: 'https://site.test' },
	},
})
