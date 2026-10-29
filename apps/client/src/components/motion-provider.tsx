'use client'

import type { ChildrenProps } from 'types/components'
import { LazyMotion } from 'motion/react'

// Animation features load after the first render so they stay out of the critical bundle.
const loadFeatures = () => import('lib/motion-features').then(mod => mod.default)

export const MotionProvider = ({ children }: ChildrenProps) => (
	<LazyMotion features={loadFeatures}>{children}</LazyMotion>
)
