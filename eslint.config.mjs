import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import parser from '@typescript-eslint/parser'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({ baseDirectory: __dirname })

const config = [
	...compat.extends('next/core-web-vitals', 'next/typescript'),
	{ languageOptions: { parser: parser, parserOptions: { project: true } } },
]

export default config
