'use client'

import { motion } from 'framer-motion'
import { transition } from '@import/constant'
import { MotionComponentProps } from '@import/types'

const MotionNav = ({ children, direction, delay, className }: MotionComponentProps) => (
	<motion.nav
		initial='hidden'
		animate='show'
		exit='hidden'
		variants={transition(direction, delay)}
		className={className}>
		{children}
	</motion.nav>
)

const MotionDiv = ({ children, direction, delay, className }: MotionComponentProps) => (
	<motion.div
		initial='hidden'
		animate='show'
		exit='hidden'
		variants={transition(direction, delay)}
		className={className}>
		{children}
	</motion.div>
)

const MotionH1 = ({ children, direction, delay, className }: MotionComponentProps) => (
	<motion.h1
		initial='hidden'
		animate='show'
		exit='hidden'
		variants={transition(direction, delay)}
		className={className}>
		{children}
	</motion.h1>
)

const MotionP = ({ children, direction, delay, className }: MotionComponentProps) => (
	<motion.p
		initial='hidden'
		animate='show'
		exit='hidden'
		variants={transition(direction, delay)}
		className={className}>
		{children}
	</motion.p>
)

export { MotionNav, MotionDiv, MotionH1, MotionP }
