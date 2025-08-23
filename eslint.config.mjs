import { FlatCompat } from '@eslint/eslintrc'
import parser from '@typescript-eslint/parser'

const compat = new FlatCompat({ baseDirectory: import.meta.dirname })

const config = [
	...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
	{ languageOptions: { parser, parserOptions: { project: './tsconfig.json' } } },
]

export default config
