'use client'

import type { AnimationProps } from 'types/components'

import { AnimatePresence, motion } from 'motion/react'
import { transition } from 'utils/animation'

const animation = (direction?: 'up' | 'down' | 'left' | 'right', delay?: number) =>
	direction && delay
		? { initial: 'hidden', animate: 'show', exit: 'hidden', variants: transition(direction, delay) }
		: {}

const div = ({
	direction,
	delay,
	...props
}: AnimationProps<React.ComponentProps<typeof motion.div>>) => (
	<motion.div {...props} {...animation(direction, delay)}>
		{props.children}
	</motion.div>
)

const h1 = ({
	direction,
	delay,
	...props
}: AnimationProps<React.ComponentProps<typeof motion.h1>>) => (
	<motion.h1 {...props} {...animation(direction, delay)}>
		{props.children}
	</motion.h1>
)

const h2 = ({
	direction,
	delay,
	...props
}: AnimationProps<React.ComponentProps<typeof motion.h2>>) => (
	<motion.h2 {...props} {...animation(direction, delay)}>
		{props.children}
	</motion.h2>
)

const nav = ({
	direction,
	delay,
	...props
}: AnimationProps<React.ComponentProps<typeof motion.nav>>) => (
	<motion.nav {...props} {...animation(direction, delay)}>
		{props.children}
	</motion.nav>
)

const p = ({
	direction,
	delay,
	...props
}: AnimationProps<React.ComponentProps<typeof motion.p>>) => (
	<motion.p {...props} {...animation(direction, delay)}>
		{props.children}
	</motion.p>
)

const span = ({
	direction,
	delay,
	...props
}: AnimationProps<React.ComponentProps<typeof motion.span>>) => (
	<motion.span {...props} {...animation(direction, delay)}>
		{props.children}
	</motion.span>
)

const path = ({
	direction,
	delay,
	...props
}: AnimationProps<React.ComponentProps<typeof motion.path>>) => (
	<motion.path {...props} {...animation(direction, delay)}>
		{props.children}
	</motion.path>
)

const linearGradient = ({
	direction,
	delay,
	...props
}: AnimationProps<React.ComponentProps<typeof motion.linearGradient>>) => (
	<motion.linearGradient {...props} {...animation(direction, delay)}>
		{props.children}
	</motion.linearGradient>
)

export { div, h1, h2, nav, p, span, path, linearGradient, AnimatePresence }
