'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'ui/motion'
import { classNames } from '../../lib/utils'
import { BrandGlyph } from 'ui/brand'

export interface OrbitNode {
	id: string
	category: string
	tech: string
	angle: number // in degrees
	radius: number // percentage of orbit half-size
	icon?: string
}

const NODES: OrbitNode[] = [
	{ id: 'client', category: 'CLIENT', tech: 'REACT 19', angle: 45, radius: 46 },
	{ id: 'render', category: 'RENDER', tech: 'NEXT.JS 16', angle: 135, radius: 46 },
	{ id: 'api', category: 'API', tech: 'NODE & NEST', angle: 225, radius: 46 },
	{ id: 'data', category: 'DATA', tech: 'POSTGRESQL', angle: 315, radius: 46 },
]

export interface BrandOrbitProps {
	className?: string
}

/**
 * BrandOrbit
 * Technical engineering centerpiece featuring the KP brand mark encircled by orbital system nodes:
 * Client / React, Render / Next.js, API / Node.js, and Data / PostgreSQL.
 * Viewport-aware: automatically pauses GPU animations when scrolled out of view.
 */
export const BrandOrbit = ({ className }: BrandOrbitProps) => {
	const shouldReduceMotion = useReducedMotion()
	const [isPaused, setIsPaused] = useState(false)
	const [isVisible, setIsVisible] = useState(true)
	const figureRef = useRef<HTMLElement>(null)

	// Pause continuous keyframe animations when scrolled off-screen
	useEffect(() => {
		const el = figureRef.current
		if (!el || typeof IntersectionObserver === 'undefined') return

		const observer = new IntersectionObserver(
			([entry]) => {
				setIsVisible(entry?.isIntersecting ?? true)
			},
			{ threshold: 0 },
		)

		observer.observe(el)
		return () => observer.disconnect()
	}, [])

	const isSpinning = !shouldReduceMotion && isVisible && !isPaused

	return (
		<figure
			ref={figureRef}
			className={classNames(
				'relative flex items-center justify-center select-none mx-auto',
				'w-[240px] h-[240px] min-[380px]:w-[270px] min-[380px]:h-[270px] sm:w-[380px] sm:h-[380px] md:w-[420px] md:h-[420px] lg:w-[460px] lg:h-[460px]',
				className,
			)}
			onMouseEnter={() => setIsPaused(true)}
			onMouseLeave={() => setIsPaused(false)}
			aria-label='Technical Architecture Brand Orbit: Client, Render, API, and Data'>
			{/* Ambient Radial Bloom */}
			<div
				className='pointer-events-none absolute -inset-8 rounded-full bg-radial from-signal/15 via-signal/5 to-transparent blur-2xl opacity-60 dark:opacity-40'
				aria-hidden='true'
			/>

			{/* Outer Concentric Orbit Track */}
			<div
				className='pointer-events-none absolute inset-0 rounded-full border border-border/40 dark:border-border-strong/30'
				aria-hidden='true'
			/>

			{/* Inner Concentric Orbit Track */}
			<div
				className='pointer-events-none absolute inset-8 sm:inset-14 md:inset-16 rounded-full border border-dashed border-border/60 dark:border-border-strong/40'
				aria-hidden='true'
			/>

			{/* Rotating Orbital Track Layer */}
			<div
				className={classNames('absolute inset-0', !shouldReduceMotion && 'animate-orbit-spin')}
				style={{
					animationPlayState: isSpinning ? 'running' : 'paused',
				}}>
				{NODES.map(node => {
					// Convert angle in degrees to rad
					const rad = (node.angle * Math.PI) / 180
					// Coordinates centered in percentage (50% center)
					const x = 50 + node.radius * Math.cos(rad)
					const y = 50 + node.radius * Math.sin(rad)

					return (
						<div
							key={node.id}
							className='absolute -translate-x-1/2 -translate-y-1/2'
							style={{ left: `${x}%`, top: `${y}%` }}>
							{/* Counter-rotate inner card so text always stays upright and legible */}
							<div
								className={classNames(!shouldReduceMotion && 'animate-orbit-spin-reverse')}
								style={{
									animationPlayState: isSpinning ? 'running' : 'paused',
								}}>
								<div className='group flex items-center gap-1.5 sm:gap-2 rounded-full border border-border/80 bg-surface/90 px-2 sm:px-2.5 py-0.5 sm:py-1 backdrop-blur-md transition-all duration-200 hover:border-signal/50 hover:bg-surface hover:shadow-[0_0_12px_rgba(255,51,102,0.3)] hover:scale-105'>
									<span
										className='h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_6px_rgba(255,51,102,0.8)] shrink-0'
										aria-hidden='true'
									/>
									<div className='flex items-baseline gap-1 font-mono text-[8px] sm:text-[10px] tracking-wider'>
										<span className='text-muted-foreground'>{node.category}</span>
										<span className='text-border-strong'>/</span>
										<span className='text-foreground font-semibold'>{node.tech}</span>
									</div>
								</div>
							</div>
						</div>
					)
				})}
			</div>

			{/* Central Pedestal Core with Brand Glyph */}
			<div className='relative z-10 flex h-16 w-16 sm:h-24 sm:w-24 items-center justify-center rounded-full border border-border-strong bg-surface-strong/90 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.3)]'>
				{/* Inner Glowing Ring */}
				<div
					className='absolute inset-1 sm:inset-1.5 rounded-full border border-signal/20 animate-pulse'
					aria-hidden='true'
				/>

				<div className='relative flex items-center justify-center'>
					<BrandGlyph
						size={28}
						className='sm:hidden transition-transform duration-300 hover:scale-110'
					/>
					<BrandGlyph
						size={40}
						className='hidden sm:block transition-transform duration-300 hover:scale-110'
					/>
				</div>
			</div>
		</figure>
	)
}
