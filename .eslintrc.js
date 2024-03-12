/** @type {import("eslint").Linter.Config} */

module.exports = {
	root: true,
	extends: ['next', 'next/core-web-vitals'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: true,
	},
}
