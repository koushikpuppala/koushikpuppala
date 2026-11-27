import type { ClassValue } from 'clsx'

import { clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Without these names tailwind-merge treats `h-control-md` or `text-body` as unknown classes, so a caller's `h-12` or `text-lg` would never replace them.
const twMerge = extendTailwindMerge({
	extend: {
		theme: {
			spacing: ['control-sm', 'control-md', 'control-lg', 'control-xl', 'row', 'sidebar', 'gutter'],
			text: ['caption', 'small', 'body', 'subheading', 'title', 'headline', 'control-lg'],
			container: ['page', 'content'],
			shadow: ['overlay'],
		},
	},
})

export const classNames = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
