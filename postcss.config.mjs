/** @type {import('postcss-load-config').Config} */

const config = {
	plugins: {
		'postcss-import': {},
		tailwindcss: {},
		autoprefixer: {},
		...(process.env.NODE_ENV === 'production' && { cssnano: { preset: 'default' } }),
	},
}

export default config
