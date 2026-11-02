import type { ClassValue } from 'clsx'

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const classNames = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
