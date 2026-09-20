'use client'

import type { PublishedExperience, PublishedHome, PublishedSocial } from 'types/models'

import Link from 'next/link'
import { toDisplayLines } from 'lib/format'
import { Button } from 'components/ui/button'
import { classNames } from 'utils/classNames'
import { LogoGlyph } from 'components/brand/logo'
import { BrandOrbit } from 'components/home/brand-orbit'
import { socialIcons } from 'components/home/home-sections'
import { ArrowDown, ArrowRight, ArrowUpRight } from 'components/icons'
import { DisplayLines, Magnetic, PulseDot } from 'components/primitives'

const orbitNodes = [
	{ label: 'Client', value: 'React', angle: 0 },
	{ label: 'Render', value: 'Next.js', angle: 90 },
	{ label: 'API', value: 'Node.js', angle: 180 },
	{ label: 'Data', value: 'PostgreSQL', angle: 270 },
]

const MetaCell = ({ label, value, mono }: { label: string; value: string; mono?: boolean }) => {
	return (
		<div className='min-w-0 px-5 py-4 sm:px-6 sm:py-5'>
			<p className='text-muted-foreground font-mono text-[0.625rem] tracking-[0.18em] uppercase'>
				{label}
			</p>
			<p
				className={classNames('text-foreground mt-1.5 text-sm text-balance', {
					'font-mono text-[0.8125rem] leading-relaxed': mono,
					'font-display font-medium tracking-tight': !mono,
				})}>
				{value}
			</p>
		</div>
	)
}

export const Hero = ({
	home,
	socials,
	current,
}: {
	home: PublishedHome
	socials: PublishedSocial[]
	current?: PublishedExperience
}) => {
	const lines = toDisplayLines(home.title, 2)
	const ctaList = home.ctas || []
	const [primary, ...secondary] = ctaList
	const subtitles = home.subtitles || []
	const role = subtitles[0] ?? 'Software Engineer – Full Stack'
	const focus = subtitles.slice(1).join(' · ')

	const tenure = /(\d+)\+?\s*years?/i.exec(home.content)?.[0]

	return (
		<section className='relative isolate overflow-hidden' aria-labelledby='hero-title'>
			<div className='mesh-bloom pointer-events-none absolute inset-0 -z-10' aria-hidden />
			<div
				className='grid-fine mask-fade-b pointer-events-none absolute inset-0 -z-10'
				aria-hidden
			/>
			<div className='noise-layer pointer-events-none absolute inset-0 -z-10' aria-hidden />
			<LogoGlyph
				aria-hidden
				className='mark-watermark absolute -top-24 -left-28 -z-10 hidden size-184 opacity-[0.07] saturate-[0.6] md:block'
			/>
			<div className='beam-sweep pointer-events-none absolute inset-x-0 top-28 -z-10 h-px' />
			<div className='beam-sweep beam-sweep-delayed pointer-events-none absolute inset-x-0 bottom-40 -z-10 h-px' />

			<div className='container-page relative pt-28 sm:pt-32 lg:pt-40'>
				<div className='enter-item text-muted-foreground flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.6875rem] tracking-[0.16em] uppercase'>
					<span className='text-foreground flex items-center gap-2'>
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

				<div className='mt-10 grid items-start gap-x-10 gap-y-14 lg:mt-14 lg:grid-cols-12'>
					<div className='lg:col-span-7 xl:col-span-8'>
						<h1 id='hero-title' className='text-display text-hero'>
							<DisplayLines lines={lines} />
						</h1>

						<div className='enter-item enter-delay-4 mt-7 flex items-center gap-4'>
							<span className='bg-signal h-px w-10 shrink-0 sm:w-16' aria-hidden />
							<p className='font-display text-foreground/90 text-lg font-medium tracking-tight text-balance sm:text-2xl'>
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
								const Icon = socialIcons[social.icon ?? ''] ?? ArrowUpRight
								return (
									<a
										key={social.id}
										href={social.url}
										target='_blank'
										rel='noreferrer noopener'
										aria-label={social.label}
										className='group border-border text-muted-foreground hover:border-signal/60 hover:text-signal-ink grid size-10 place-items-center rounded-lg border transition-all duration-300 hover:-translate-y-0.5'>
										<Icon className='size-4' />
									</a>
								)
							})}
							<Link
								href='/resume'
								className='link-underline text-muted-foreground hover:text-foreground ml-1 inline-flex items-center gap-1.5 py-2 font-mono text-[0.8125rem] transition-colors'>
								Resume <ArrowUpRight className='size-3.5' />
							</Link>
						</div>
					</div>

					<div className='enter-fade enter-delay-6 lg:col-span-5 lg:pt-6 xl:col-span-4'>
						<div className='float-y'>
							<BrandOrbit nodes={orbitNodes} caption='end-to-end' />
						</div>
					</div>
				</div>

				<div className='enter-item enter-delay-6 mt-16 lg:mt-20'>
					<div className='hairline-grid border-border bg-surface/40 grid overflow-hidden rounded-xl border sm:grid-cols-3'>
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
						className='group text-muted-foreground hover:text-foreground inline-flex items-center gap-2 font-mono text-[0.625rem] tracking-[0.2em] uppercase transition-colors'>
						Selected work
						<ArrowDown className='size-3.5 transition-transform duration-500 group-hover:translate-y-1' />
					</a>
				</div>
			</div>
		</section>
	)
}
