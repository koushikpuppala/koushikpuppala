import type {
	ArtProps,
	ProjectVisualProps,
	ProjectVisualVariant,
	SeededArtProps,
} from 'types/components/client'
import Image from 'next/image'
import { useId, useMemo } from 'react'
import { classNames } from 'utils/classNames'

const hash = (input: string) => {
	let h = 2166136261

	for (let i = 0; i < input.length; i += 1) {
		h ^= input.charCodeAt(i)
		h = Math.imul(h, 16777619)
	}

	return h >>> 0
}

const mulberry32 = (seed: number) => {
	let a = seed

	return () => {
		a |= 0
		a = (a + 0x6d2b79f5) | 0
		let t = Math.imul(a ^ (a >>> 15), 1 | a)
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296
	}
}

const variants: ProjectVisualVariant[] = ['flow', 'lattice', 'waves', 'orbit']

const r2 = (n: number) => Math.round(n * 100) / 100

const FlowArt = ({ rand, glowId }: ArtProps) => {
	const rows = 7

	return (
		<g>
			{Array.from({ length: rows }, (_, i) => i).map(i => {
				const y = 40 + i * 42

				const amp = r2(18 + rand() * 46)

				const shift = r2(rand() * 60)

				return (
					<path
						key={i}
						d={`M -20 ${y} C ${r2(90 + shift)} ${r2(y - amp)}, ${r2(230 - shift)} ${r2(y + amp)}, 420 ${r2(y - amp * 0.4)}`}
						fill='none'
						stroke='currentColor'
						strokeOpacity={r2(0.14 + i * 0.045)}
						strokeWidth={i === rows - 3 ? 1.6 : 1}
					/>
				)
			})}
			<circle cx={296} cy={124} r={54} fill={`url(#${glowId})`} opacity={0.85} />
			<circle cx={296} cy={124} r={54} fill='none' stroke='var(--signal)' strokeOpacity={0.5} />
		</g>
	)
}

const LatticeArt = ({ rand }: SeededArtProps) => {
	const cols = 10
	const rows = 7
	const cells: Array<[number, number]> = []

	for (let x = 0; x < cols; x += 1) {
		for (let y = 0; y < rows; y += 1) {
			if (rand() > 0.86) cells.push([x, y])
		}
	}

	return (
		<g>
			{Array.from({ length: cols + 1 }, (_, i) => i).map(i => (
				<line
					key={`v${i}`}
					x1={i * 40}
					y1={0}
					x2={i * 40}
					y2={280}
					stroke='currentColor'
					strokeOpacity={0.1}
				/>
			))}
			{Array.from({ length: rows + 1 }, (_, i) => i).map(i => (
				<line
					key={`h${i}`}
					x1={0}
					y1={i * 40}
					x2={400}
					y2={i * 40}
					stroke='currentColor'
					strokeOpacity={0.1}
				/>
			))}
			{cells.map(([x, y], i) => (
				<rect
					key={`c${x}-${y}`}
					x={x * 40}
					y={y * 40}
					width={40}
					height={40}
					fill='var(--signal)'
					opacity={i % 3 === 0 ? 0.55 : 0.16}
				/>
			))}
			<rect
				x={120}
				y={80}
				width={160}
				height={120}
				fill='none'
				stroke='var(--signal)'
				strokeOpacity={0.7}
			/>
		</g>
	)
}

const WavesArt = ({ rand }: SeededArtProps) => {
	const bars = 34

	return (
		<g>
			{Array.from({ length: bars }, (_, i) => i).map(i => {
				const h = r2(18 + rand() * 190)

				return (
					<rect
						key={i}
						x={r2(8 + i * 11.4)}
						y={r2(250 - h)}
						width={5}
						height={h}
						rx={2.5}
						fill={i % 7 === 3 ? 'var(--signal)' : 'currentColor'}
						opacity={i % 7 === 3 ? 0.85 : 0.14}
					/>
				)
			})}
			<line x1={0} y1={250} x2={400} y2={250} stroke='currentColor' strokeOpacity={0.25} />
		</g>
	)
}

const OrbitArt = ({ rand, glowId }: ArtProps) => {
	const rings = [58, 92, 128, 166]

	return (
		<g>
			{rings.map((r, i) => (
				<circle
					key={r}
					cx={200}
					cy={140}
					r={r}
					fill='none'
					stroke='currentColor'
					strokeOpacity={0.16}
					strokeDasharray={i % 2 ? '3 7' : undefined}
				/>
			))}
			{rings.map((r, i) => {
				const angle = rand() * Math.PI * 2

				return (
					<circle
						key={`d${r}`}
						cx={r2(200 + Math.cos(angle) * r)}
						cy={r2(140 + Math.sin(angle) * r)}
						r={i === 1 ? 7 : 4}
						fill='var(--signal)'
						opacity={i === 1 ? 1 : 0.5}
					/>
				)
			})}
			<circle cx={200} cy={140} r={26} fill={`url(#${glowId})`} />
			<circle cx={200} cy={140} r={26} fill='none' stroke='var(--signal)' strokeOpacity={0.6} />
		</g>
	)
}

export const ProjectVisual = ({
	slug,
	title,
	coverImageUrl,
	index,
	className,
	eager = false,
	frame = 'cover',
}: ProjectVisualProps) => {
	const { variant, rand } = useMemo(() => {
		const seed = hash(slug)

		return {
			variant: variants[seed % variants.length] as ProjectVisualVariant,
			rand: mulberry32(seed),
		}
	}, [slug])

	const glowId = `pv-signal-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`

	if (coverImageUrl)
		return (
			<div className={classNames('bg-surface-strong relative overflow-hidden', className)}>
				<Image
					alt={title}
					fill
					sizes='(min-width: 1024px) 60vw, 100vw'
					decoding='async'
					src={coverImageUrl}
					loading={eager ? 'eager' : 'lazy'}
					className='object-cover transition-transform duration-[1.2s] ease-(--ease-out-expo) group-hover:scale-[1.04]'
				/>
			</div>
		)

	return (
		<div
			className={classNames(
				'bg-surface-strong text-foreground relative overflow-hidden',
				className,
			)}
			aria-hidden>
			<div className='grid-micro absolute inset-0 opacity-40' />
			<svg
				viewBox={frame === 'wide' ? '-190 -70 780 420' : '0 0 400 280'}
				preserveAspectRatio='xMidYMid slice'
				className='absolute inset-0 size-full transition-transform duration-[1.2s] ease-(--ease-out-expo) group-hover:scale-[1.06]'
				role='presentation'>
				<defs>
					<radialGradient id={glowId} cx='50%' cy='50%' r='50%'>
						<stop offset='0%' stopColor='var(--signal)' stopOpacity='0.55' />
						<stop offset='100%' stopColor='var(--signal)' stopOpacity='0' />
					</radialGradient>
				</defs>
				{variant === 'flow' ? <FlowArt rand={rand} glowId={glowId} /> : null}
				{variant === 'lattice' ? <LatticeArt rand={rand} /> : null}
				{variant === 'waves' ? <WavesArt rand={rand} /> : null}
				{variant === 'orbit' ? <OrbitArt rand={rand} glowId={glowId} /> : null}
			</svg>
			<div
				className='absolute inset-0'
				style={{ background: 'linear-gradient(160deg, transparent 40%, var(--surface) 130%)' }}
			/>
			{index ? (
				<span className='text-muted-foreground absolute bottom-4 left-5 font-mono text-[0.625rem] tracking-[0.2em] uppercase'>
					{index}
				</span>
			) : null}
		</div>
	)
}
