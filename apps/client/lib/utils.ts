import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { classNames } from 'utils/classNames'

export { classNames }

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}
