import { LogoGlyph } from '@/components/brand/logo'
import { cn } from '@/lib/utils'

export type OrbitNode = { label: string; value: string; angle: number }

const RADIAL_TICKS = [
	{ x1: 194, y1: 100, x2: 186, y2: 100 },
	{ x1: 190.8, y1: 124.33, x2: 186.93, y2: 123.29 },
	{ x1: 181.41, y1: 147, x2: 177.94, y2: 145 },
	{ x1: 166.47, y1: 166.47, x2: 163.64, y2: 163.64 },
	{ x1: 147, y1: 181.41, x2: 145, y2: 177.94 },
	{ x1: 124.33, y1: 190.8, x2: 123.29, y2: 186.93 },
	{ x1: 100, y1: 194, x2: 100, y2: 186 },
	{ x1: 75.67, y1: 190.8, x2: 76.71, y2: 186.93 },
	{ x1: 53, y1: 181.41, x2: 55, y2: 177.94 },
	{ x1: 33.53, y1: 166.47, x2: 36.36, y2: 163.64 },
	{ x1: 18.59, y1: 147, x2: 22.06, y2: 145 },
	{ x1: 9.2, y1: 124.33, x2: 13.07, y2: 123.29 },
	{ x1: 6, y1: 100, x2: 14, y2: 100 },
	{ x1: 9.2, y1: 75.67, x2: 13.07, y2: 76.71 },
	{ x1: 18.59, y1: 53, x2: 22.06, y2: 55 },
	{ x1: 33.53, y1: 33.53, x2: 36.36, y2: 36.36 },
	{ x1: 53, y1: 18.59, x2: 55, y2: 22.06 },
	{ x1: 75.67, y1: 9.2, x2: 76.71, y2: 13.07 },
	{ x1: 100, y1: 6, x2: 100, y2: 14 },
	{ x1: 124.33, y1: 9.2, x2: 123.29, y2: 13.07 },
	{ x1: 147, y1: 18.59, x2: 145, y2: 22.06 },
	{ x1: 166.47, y1: 33.53, x2: 163.64, y2: 36.36 },
	{ x1: 181.41, y1: 53, x2: 177.94, y2: 55 },
	{ x1: 190.8, y1: 75.67, x2: 186.93, y2: 76.71 },
] as const

/**
 * Hero motif — the brand mark at the centre of the stack it renders.
 *
 * Purely presentational: the SVG rings are decorative, and the labelled nodes
 * repeat the same four layers the resume names. Rotation is CSS-only and is
 * disabled by the global `prefers-reduced-motion` rule.
 */
export function BrandOrbit({
	nodes,
	caption,
	className,
}: {
	nodes: OrbitNode[]
	caption?: string
	className?: string
}) {
	const label = `End-to-end stack: ${nodes.map(n => `${n.label} ${n.value}`).join(', ')}`

	return (
		<div
			className={cn('relative mx-auto aspect-square w-full max-w-[24rem]', className)}
			role='img'
			aria-label={label}>
			{/* rings */}
			<svg
				viewBox='0 0 200 200'
				className='absolute inset-0 size-full text-border-strong'
				aria-hidden
				focusable='false'>
				<defs>
					<linearGradient id='orbit-arc' x1='0' y1='0' x2='1' y2='1'>
						<stop offset='0%' stopColor='var(--signal)' stopOpacity='0.9' />
						<stop offset='100%' stopColor='var(--signal)' stopOpacity='0' />
					</linearGradient>
				</defs>

				<circle cx='100' cy='100' r='94' fill='none' stroke='currentColor' strokeWidth='0.5' />
				<circle
					cx='100'
					cy='100'
					r='72'
					fill='none'
					stroke='currentColor'
					strokeWidth='0.5'
					strokeDasharray='1 6'
					strokeLinecap='round'
				/>
				<circle cx='100' cy='100' r='46' fill='none' stroke='currentColor' strokeWidth='0.5' />

				<g className='orbit-spin origin-center'>
					<circle
						cx='100'
						cy='100'
						r='94'
						fill='none'
						stroke='url(#orbit-arc)'
						strokeWidth='1.5'
						strokeLinecap='round'
						strokeDasharray='120 470'
					/>
				</g>
				<g className='orbit-spin-reverse origin-center'>
					<circle
						cx='100'
						cy='100'
						r='46'
						fill='none'
						stroke='url(#orbit-arc)'
						strokeWidth='1.5'
						strokeLinecap='round'
						strokeDasharray='52 240'
					/>
				</g>

				{/* radial ticks */}
				<g className='text-border-strong' stroke='currentColor' strokeWidth='0.5'>
					{RADIAL_TICKS.map((tick, i) => (
						<line
							// biome-ignore lint/suspicious/noArrayIndexKey: radial ticks are deterministic svg geometry
							key={i}
							x1={tick.x1}
							y1={tick.y1}
							x2={tick.x2}
							y2={tick.y2}
						/>
					))}
				</g>
			</svg>

			{/* centre mark */}
			<div className='absolute inset-0 grid place-items-center'>
				<div className='relative grid size-[30%] place-items-center'>
					<div
						className='absolute inset-[-70%] opacity-80 blur-2xl'
						style={{ background: 'var(--glow-signal)' }}
						aria-hidden
					/>
					<LogoGlyph
						className='relative size-full text-foreground drop-shadow-[0_2px_18px_color-mix(in_oklab,var(--signal)_45%,transparent)]'
						strokeWidth={3.4}
					/>
				</div>
			</div>

			{/* labelled nodes */}
			{nodes.map(node => {
				const a = (node.angle / 360) * Math.PI * 2 - Math.PI / 2
				const left = Math.round((50 + Math.cos(a) * 36) * 100) / 100
				const top = Math.round((50 + Math.sin(a) * 36) * 100) / 100
				return (
					<div
						key={node.label}
						className='absolute -translate-x-1/2 -translate-y-1/2'
						style={{ left: `${left}%`, top: `${top}%` }}
						aria-hidden>
						<div className='flex items-center gap-2 rounded-full border border-border bg-background/85 py-1.5 pr-3 pl-2 backdrop-blur-sm'>
							<span className='size-1.5 shrink-0 rounded-full bg-signal' />
							<span className='font-mono text-[0.625rem] tracking-[0.1em] whitespace-nowrap text-foreground uppercase'>
								{node.value}
							</span>
						</div>
					</div>
				)
			})}

			{caption ? (
				<p
					className='absolute inset-x-0 -bottom-2 text-center font-mono text-[0.625rem] tracking-[0.2em] text-muted-foreground uppercase'
					aria-hidden>
					{caption}
				</p>
			) : null}
		</div>
	)
}
