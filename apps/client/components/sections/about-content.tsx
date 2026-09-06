'use client'

import Link from 'next/link'
import { Surface } from 'ui/surface'
import { BrandGlyph } from 'ui/brand'
import { SignalArrow } from 'ui/motion'
import { classNames } from '../../lib/utils'
import type { PortfolioAbout } from '../../lib/about-data'

export type AboutContentProps = {
	data: PortfolioAbout
	className?: string
}

/**
 * AboutContent
 * Recreates the Lovable editorial About section layout:
 * - Left column: Engineering pedestal, brand glyph, coordinates, live availability, and verified highlights
 * - Right column: Huge editorial lead statement, narrative biography, technical telemetry metrics grid, and CTAs
 */
export const AboutContent = ({ data, className }: AboutContentProps) => {
	return (
		<div
			className={classNames(
				'grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start',
				className,
			)}>
			{/* Left Column: Profile Pedestal & Verified Highlights */}
			<div className='lg:col-span-5 space-y-6'>
				{/* Identity Pedestal Card */}
				<Surface
					variant='bordered'
					className='p-5 sm:p-8 rounded-xl sm:rounded-2xl border border-border/70 bg-surface/50 backdrop-blur-md flex flex-col items-center text-center relative overflow-hidden'>
					{/* Subtle Background Radial Glow */}
					<div
						className='pointer-events-none absolute -top-12 -left-12 h-44 w-44 rounded-full bg-radial from-signal/15 via-transparent to-transparent blur-2xl'
						aria-hidden='true'
					/>

					{/* Brand Pedestal Glyph Ring */}
					<div className='relative mb-5 flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full border border-border-strong bg-surface-strong/90 shadow-[0_4px_24px_rgba(0,0,0,0.25)]'>
						<div
							className='absolute inset-1.5 rounded-full border border-signal/20 animate-pulse'
							aria-hidden='true'
						/>
						<BrandGlyph size={48} className='transition-transform duration-300 hover:scale-110' />
					</div>

					{/* Name & Handle */}
					<h3 className='font-display text-2xl sm:text-3xl font-semibold text-foreground tracking-tight'>
						Koushik Puppala
					</h3>
					<span className='font-mono text-xs text-signal font-medium pt-1'>@koushikpuppala</span>

					{/* Role Badge */}
					<div className='mt-3 inline-flex items-center rounded-full border border-border/80 bg-surface/80 px-3 py-1 font-mono text-[11px] text-foreground font-medium'>
						Senior Full-Stack & AI Engineer
					</div>

					{/* Coordinates & Location Metadata */}
					<div className='mt-5 w-full pt-4 border-t border-border/50 space-y-1 font-mono text-xs text-muted-foreground'>
						<div className='flex items-center justify-between gap-2'>
							<span className='text-[10px] uppercase tracking-wider shrink-0'>LOCATION</span>
							<span className='text-foreground truncate text-right'>{data.location}</span>
						</div>
						<div className='flex items-center justify-between gap-2'>
							<span className='text-[10px] uppercase tracking-wider shrink-0'>COORDINATES</span>
							<span className='truncate text-right'>{data.coordinates}</span>
						</div>
						<div className='flex items-center justify-between gap-2'>
							<span className='text-[10px] uppercase tracking-wider shrink-0'>TIMEZONE</span>
							<span className='truncate text-right'>{data.timezone}</span>
						</div>
					</div>

					{/* Live Availability Strip */}
					<div className='mt-4 w-full rounded-lg border border-status-live/30 bg-status-live-soft p-2.5 flex items-center justify-center gap-2 font-mono text-[10px] text-status-live font-semibold'>
						<span
							className='h-1.5 w-1.5 rounded-full bg-status-live animate-pulse'
							aria-hidden='true'
						/>
						<span className='tracking-wider uppercase'>
							AVAILABLE FOR WORK {'//'} GLOBAL REMOTE
						</span>
					</div>
				</Surface>

				{/* Highlights Card */}
				<Surface
					variant='bordered'
					className='p-4 sm:p-7 rounded-xl sm:rounded-2xl border border-border/70 bg-surface/40 backdrop-blur-md space-y-3.5'>
					<span className='font-mono text-[10px] uppercase tracking-widest text-signal font-semibold block'>
						VERIFIED TRACK RECORD
					</span>

					<ul className='space-y-2.5' aria-label='Engineering Highlights'>
						{data.highlights.map(item => (
							<li
								key={item}
								className='flex items-start gap-2.5 font-sans text-xs sm:text-sm text-foreground/80 leading-relaxed'>
								<span className='text-signal font-mono text-xs shrink-0 mt-0.5' aria-hidden='true'>
									✦
								</span>
								<span>{item}</span>
							</li>
						))}
					</ul>
				</Surface>
			</div>

			{/* Right Column: Editorial Narrative & Telemetry Metrics */}
			<div className='lg:col-span-7 space-y-8'>
				{/* Large Editorial Introductory Statement */}
				<div className='space-y-4'>
					<blockquote className='font-display text-xl sm:text-3xl md:text-4xl font-medium tracking-tight text-foreground leading-[1.2] break-words'>
						&ldquo;{data.leadStatement}&rdquo;
					</blockquote>

					<p className='font-sans text-base sm:text-lg text-muted-foreground leading-relaxed pt-2'>
						{data.content}
					</p>

					<p className='font-sans text-sm sm:text-base text-muted-foreground/90 leading-relaxed'>
						{data.biography}
					</p>
				</div>

				{/* Telemetry Metrics Counter Grid */}
				<div className='pt-2'>
					<span className='font-mono text-[10px] uppercase tracking-widest text-signal font-semibold block mb-3'>
						ENGINEERING TELEMETRY {'//'} BENCHMARKS
					</span>

					<div className='grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5'>
						{data.stats.map(metric => (
							<Surface
								key={metric.label}
								variant='bordered'
								className='p-3.5 sm:p-5 rounded-xl border border-border/70 bg-surface/50 text-center flex flex-col justify-between transition-all duration-200 hover:border-signal/40 hover:bg-surface hover:shadow-[0_0_16px_rgba(255,51,102,0.1)] hover:-translate-y-0.5'>
								<span className='font-display text-xl sm:text-3xl font-semibold text-foreground tracking-tight'>
									{metric.value}
								</span>
								<div className='pt-2'>
									<span className='font-mono text-[10px] uppercase tracking-wider text-signal font-medium block'>
										{metric.label}
									</span>
									{metric.detail && (
										<span className='font-mono text-[9px] text-muted-foreground/80 block pt-0.5 line-clamp-1'>
											{metric.detail}
										</span>
									)}
								</div>
							</Surface>
						))}
					</div>
				</div>

				{/* Call to Action Bar */}
				<div className='pt-4 border-t border-border/50 flex flex-wrap items-center gap-4'>
					<Link
						href={data.ctaUrl}
						className='group inline-flex items-center gap-2 rounded-full bg-signal px-5 py-2.5 font-mono text-xs font-semibold text-white shadow-[0_0_20px_rgba(255,51,102,0.3)] transition-all duration-200 hover:bg-signal-hover hover:shadow-[0_0_28px_rgba(255,51,102,0.45)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal'>
						<span>{data.ctaLabel}</span>
						<SignalArrow
							size={12}
							className='transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5'
						/>
					</Link>

					<Link
						href='/resume'
						className='inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 font-mono text-xs text-foreground transition-colors hover:border-signal/40 hover:bg-surface-strong active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal'>
						<span>View Credentials</span>
					</Link>
				</div>
			</div>
		</div>
	)
}
