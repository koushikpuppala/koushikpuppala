import type { ClassValue } from 'clsx'

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// twMerge resolves conflicting Tailwind utilities so the last one wins, e.g. 'px-2' then 'px-4'.
export const classNames = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
