/** @type {import('prettier').Config} */

const config = {
	tabWidth: 2,
	semi: false,
	useTabs: true,
	printWidth: 100,
	singleQuote: true,
	arrowParens: 'avoid',
	jsxSingleQuote: true,
	bracketSameLine: true,
	plugins: ['prettier-plugin-tailwindcss'],
}

export default config
