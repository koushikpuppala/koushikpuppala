'use client'

import Link from 'next/link'
import type { Experience, Home, Social } from '@/lib/api-types'
import { LogoGlyph } from '@/components/brand/logo'
import { BrandOrbit } from '@/components/portfolio/brand-orbit'
import { DisplayLines, Magnetic, PulseDot } from '@/components/primitives'
import { ArrowDown, ArrowRight, ArrowUpRight } from '@/components/icons'
import { socialIcons } from '@/components/portfolio/home-sections'
import { Button } from '@/components/ui/button'
import { toDisplayLines } from '@/lib/format'
import { cn } from '@/lib/utils'

/** The four layers the resume names, read left-to-right around the mark. */
const orbitNodes = [
	{ label: 'Client', value: 'React', angle: 0 },
	{ label: 'Render', value: 'Next.js', angle: 90 },
	{ label: 'API', value: 'Node.js', angle: 180 },
	{ label: 'Data', value: 'PostgreSQL', angle: 270 },
]

function MetaCell({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
	return (
		<div className='min-w-0 px-5 py-4 sm:px-6 sm:py-5'>
			<p className='font-mono text-[0.625rem] tracking-[0.18em] text-muted-foreground uppercase'>
				{label}
			</p>
			<p
				className={cn(
					'mt-1.5 text-sm text-balance text-foreground',
					mono
						? 'font-mono text-[0.8125rem] leading-relaxed'
						: 'font-display font-medium tracking-tight',
				)}>
				{value}
			</p>
		</div>
	)
}

export function Hero({
	home,
	socials,
	current,
}: {
	home: Home
	socials: Social[]
	current?: Experience | undefined
}) {
	const lines = toDisplayLines(home.title, 2)
	const [primary, ...secondary] = home.ctas
	const role = home.subtitles[0] ?? 'Software Engineer – Full Stack'
	const focus = home.subtitles.slice(1).join(' · ')
	/* Resume-backed tenure, read from the published summary rather than assumed. */
	const tenure = /(\d+)\+?\s*years?/i.exec(home.content)?.[0]

	return (
		<section className='relative isolate overflow-hidden' aria-labelledby='hero-title'>
			{/* ambient layers */}
			<div className='mesh-bloom pointer-events-none absolute inset-0 -z-10' aria-hidden />
			<div
				className='grid-fine mask-fade-b pointer-events-none absolute inset-0 -z-10'
				aria-hidden
			/>
			<div className='noise-layer pointer-events-none absolute inset-0 -z-10' aria-hidden />
			<LogoGlyph
				className='mark-watermark opacity-[0.07] saturate-[0.6] absolute -top-24 -left-28 -z-10 hidden size-[46rem] md:block'
				strokeWidth={2.2}
				aria-hidden
			/>
			<div className='beam-sweep pointer-events-none absolute inset-x-0 top-28 -z-10 h-px' />
			<div className='beam-sweep beam-sweep-delayed pointer-events-none absolute inset-x-0 bottom-40 -z-10 h-px' />

			<div className='container-page relative pt-28 sm:pt-32 lg:pt-40'>
				{/* ------------------------------------------------------ status row */}
				<div className='enter-item flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.6875rem] tracking-[0.16em] text-muted-foreground uppercase'>
					<span className='flex items-center gap-2 text-foreground'>
						<PulseDot />
						{role}
					</span>
					<span aria-hidden className='text-signal-ink'>
						{home.separator}
					</span>
					<span>India</span>
					{current ? (
						<span className='hidden items-center gap-5 sm:flex'>
							<span aria-hidden className='text-signal-ink'>
								{home.separator}
							</span>
							{current.organization}
						</span>
					) : null}
				</div>

				{/* ----------------------------------------------------------- name */}
				<div className='mt-10 grid items-start gap-x-10 gap-y-14 lg:mt-14 lg:grid-cols-12'>
					<div className='lg:col-span-7 xl:col-span-8'>
						<h1 id='hero-title' className='text-display text-hero'>
							<DisplayLines lines={lines} />
						</h1>

						<div className='enter-item enter-delay-4 mt-7 flex items-center gap-4'>
							<span className='h-px w-10 shrink-0 bg-signal sm:w-16' aria-hidden />
							<p className='font-display text-lg font-medium tracking-tight text-balance text-foreground/90 sm:text-2xl'>
								{role}
							</p>
						</div>

						<p className='enter-item enter-delay-5 text-lead mt-7 max-w-xl'>{home.content}</p>

						<div className='enter-item enter-delay-6 mt-9 flex flex-wrap items-center gap-3'>
							{primary ? (
								<Magnetic>
									<Button asChild size='xl' variant='signal' className='group'>
										<Link href={primary.href}>
											{primary.label}
											<ArrowRight className='arrow-slide size-4' />
										</Link>
									</Button>
								</Magnetic>
							) : null}
							{secondary.map(cta => (
								<Magnetic key={cta.href} strength={0.18}>
									<Button asChild size='xl' variant='outline'>
										<Link href={cta.href}>{cta.label}</Link>
									</Button>
								</Magnetic>
							))}
						</div>

						<div className='enter-item enter-delay-6 mt-9 flex flex-wrap items-center gap-x-3 gap-y-4'>
							{socials.map(social => {
								const Icon = socialIcons[social.platform] ?? ArrowUpRight
								return (
									<a
										key={social.id}
										href={social.url}
										target='_blank'
										rel='noreferrer noopener'
										aria-label={social.label}
										className='group grid size-10 place-items-center rounded-lg border border-border text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-signal/60 hover:text-signal-ink'>
										<Icon className='size-4' />
									</a>
								)
							})}
							<Link
								href='/resume'
								className='link-underline ml-1 inline-flex items-center gap-1.5 py-2 font-mono text-[0.8125rem] text-muted-foreground transition-colors hover:text-foreground'>
								Resume <ArrowUpRight className='size-3.5' />
							</Link>
						</div>
					</div>

					{/* --------------------------------------------------------- motif */}
					<div className='enter-fade enter-delay-6 lg:col-span-5 lg:pt-6 xl:col-span-4'>
						<div className='float-y'>
							<BrandOrbit nodes={orbitNodes} caption='end-to-end' />
						</div>
					</div>
				</div>

				{/* ------------------------------------------------------ meta strip */}
				<div className='enter-item enter-delay-6 mt-16 lg:mt-20'>
					<div className='hairline-grid grid overflow-hidden rounded-xl border border-border bg-surface/40 sm:grid-cols-3'>
						<MetaCell label='Based in' value={current?.location ?? 'India'} />
						<MetaCell
							label='Currently'
							value={current ? `${current.role} · ${current.organization}` : 'Full Stack Developer'}
						/>
						<MetaCell label={tenure ? 'Experience' : 'Focus'} value={tenure ?? focus} mono />
					</div>
				</div>

				<div className='flex justify-center pt-10 pb-14 lg:pt-14'>
					<a
						href='#work'
						className='group inline-flex items-center gap-2 font-mono text-[0.625rem] tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-foreground'>
						Selected work
						<ArrowDown className='size-3.5 transition-transform duration-500 group-hover:translate-y-1' />
					</a>
				</div>
			</div>
		</section>
	)
}
