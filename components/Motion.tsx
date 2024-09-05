'use client'

import { motion } from 'framer-motion'
import { transition } from '@import/constant'
import { MotionProps } from '@import/types'

const div = ({ children, direction, delay, className }: MotionProps) => (
	<motion.div
		initial='hidden'
		animate='show'
		exit='hidden'
		variants={transition(direction, delay)}
		className={className}>
		{children}
	</motion.div>
)

const h1 = ({ children, direction, delay, className }: MotionProps) => (
	<motion.h1
		initial='hidden'
		animate='show'
		exit='hidden'
		variants={transition(direction, delay)}
		className={className}>
		{children}
	</motion.h1>
)

const nav = ({ children, direction, delay, className }: MotionProps) => (
	<motion.nav
		initial='hidden'
		animate='show'
		exit='hidden'
		variants={transition(direction, delay)}
		className={className}>
		{children}
	</motion.nav>
)

const p = ({ children, direction, delay, className }: MotionProps) => (
	<motion.p
		initial='hidden'
		animate='show'
		exit='hidden'
		variants={transition(direction, delay)}
		className={className}>
		{children}
	</motion.p>
)

export { div, h1, nav, p }
