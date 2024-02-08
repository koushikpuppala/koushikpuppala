/** @type {import('prettier').Config} */

module.exports = {
	tabWidth: 4,
	semi: false,
	useTabs: true,
	printWidth: 120,
	singleQuote: true,
	arrowParens: 'avoid',
	jsxSingleQuote: true,
	bracketSameLine: true,
	endOfLine: 'crlf',
	plugins: ['prettier-plugin-tailwindcss'],
	overrides: [
		{
			files: '*.yml',
			options: {
				tabWidth: 2,
			},
		},
	],
}
