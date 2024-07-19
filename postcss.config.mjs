/** @type {import('postcss-load-config').Config} */

export default {
	plugins: {
		'postcss-import': {},
		tailwindcss: {},
		autoprefixer: {},
		...(process.env.NODE_ENV === 'production' && { cssnano: { preset: 'default' } }),
	},
}
