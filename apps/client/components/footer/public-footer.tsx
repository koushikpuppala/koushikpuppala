'use client'

import Link from 'next/link'
import { BrandGlyph, SignalRule, AmbientBloom } from 'ui/brand'
import { PageContainer } from 'ui/container'
import { SignalArrow } from 'ui/motion'
import { BackToTop } from './back-to-top'
import type { PortfolioSocial } from '../../lib/social-data'

const FOOTER_NAV = [
	{ index: '01', label: 'Selected Work', href: '/#projects' },
	{ index: '02', label: 'Career Trajectory', href: '/#experience' },
	{ index: '03', label: 'Technical Stack', href: '/#skills' },
	{ index: '04', label: 'Engineering Philosophy', href: '/#about' },
	{ index: '05', label: 'Academic Background', href: '/#education' },
	{ index: '06', label: 'Authoritative Resume', href: '/resume' },
	{ index: '07', label: 'Direct Inquiries', href: '/contact' },
]

const FOOTER_NETWORKS = [
	{
		label: 'GitHub',
		handle: '@koushikpuppala',
		url: 'https://github.com/koushikpuppala',
	},
	{
		label: 'LinkedIn',
		handle: 'in/koushikpuppala',
		url: 'https://www.linkedin.com/in/koushikpuppala',
	},
	{
		label: 'Twitter / X',
		handle: '@puppala_koushik',
		url: 'https://twitter.com/puppala_koushik',
	},
	{
		label: 'Discord Hub',
		handle: 'koushikpuppala',
		url: 'https://discord.gg/MsJ99j5Bcv',
	},
	{
		label: 'Direct Email',
		handle: 'koushikpuppala@koushikpuppala.com',
		url: 'mailto:koushikpuppala@koushikpuppala.com',
	},
]

export type PublicFooterProps = {
	className?: string
	socials?: PortfolioSocial[]
}

/**
 * PublicFooter
 * Recreates the Lovable Footer:
 * - KP architectural brand monogram and professional identity statement
 * - System navigation directory with technical indices (01-07)
 * - Verified networks & external communication links
 * - Curriculum Vitae download & inquiry dispatch action panel
 * - Telemetry status strip with live operational pulse, WCAG AA compliance, and Back to Top micro-interaction
 */
export const PublicFooter = ({ className, socials }: PublicFooterProps) => {
	const networks =
		socials && socials.length > 0
			? socials.map(s => ({
					label: s.label,
					handle: s.handle || s.label,
					url: s.url,
				}))
			: FOOTER_NETWORKS
	const currentYear = 2026

	return (
		<footer
			className={`relative z-10 w-full border-t border-border/80 bg-background/95 backdrop-blur-md pt-16 sm:pt-20 pb-12 sm:pb-16 overflow-hidden transition-colors duration-300 ${
				className || ''
			}`}>
			{/* Top Edge Horizon Glow Rule */}
			<div className='absolute top-0 inset-x-0 pointer-events-none'>
				<SignalRule variant='centered' glow dot />
			</div>

			{/* Subtle Atmospheric Ambient Bloom */}
			<AmbientBloom size='lg' position='bottom-left' intensity='subtle' />

			<PageContainer className='space-y-12 sm:space-y-16'>
				{/* Main 4-Column Directory Grid */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 items-start'>
					{/* Column 1: Brand & Professional Identity (4 cols) */}
					<div className='lg:col-span-4 space-y-5'>
						<div className='flex items-center gap-3'>
							<BrandGlyph size={36} className='text-foreground' />
							<div>
								<span className='font-display font-semibold text-lg tracking-tight text-foreground'>
									KOUSHIK PUPPALA
								</span>
								<div className='font-mono text-[11px] text-signal font-medium uppercase tracking-wider'>
									SOFTWARE ENGINEER {'//'} SYSTEMS ARCHITECT
								</div>
							</div>
						</div>

						<p className='text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm'>
							Software engineer at Upraised® specializing in resilient distributed systems, scalable
							microservices, and modern web architectures with Next.js 16, NestJS 11, and
							PostgreSQL.
						</p>

						{/* Operational Status Pill */}
						<div className='inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/70 bg-surface/60 text-muted-foreground font-mono text-[10px] sm:text-[11px]'>
							<span
								className='h-2 w-2 rounded-full bg-signal animate-pulse shrink-0'
								aria-hidden='true'
							/>
							<span className='break-words'>ALL SYSTEMS NOMINAL {'//'} PRODUCTION</span>
						</div>
					</div>

					{/* Column 2: System Navigation (3 cols) */}
					<div className='lg:col-span-3 space-y-4'>
						<div className='font-mono text-xs uppercase tracking-widest text-signal font-semibold'>
							SYSTEM NAVIGATION
						</div>

						<ul
							className='space-y-2 list-none p-0 m-0 text-xs font-mono'
							aria-label='System directory'>
							{FOOTER_NAV.map(item => (
								<li key={item.index}>
									<Link
										href={item.href}
										className='group inline-flex items-center gap-2 text-muted-foreground hover:text-signal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal rounded py-1'>
										<span className='text-muted-foreground/50 group-hover:text-signal/70 transition-colors'>
											{item.index} {'//'}
										</span>
										<span className='text-foreground group-hover:text-signal transition-colors font-medium'>
											{item.label}
										</span>
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Column 3: Verified Channels (2 cols) */}
					<div className='lg:col-span-2 space-y-4'>
						<div className='font-mono text-xs uppercase tracking-widest text-signal font-semibold'>
							VERIFIED NETWORKS
						</div>

						<ul
							className='space-y-2.5 list-none p-0 m-0 text-xs font-mono'
							aria-label='Verified network channels'>
							{networks.map(net => (
								<li key={net.label}>
									<a
										href={net.url}
										target={net.url.startsWith('http') ? '_blank' : undefined}
										rel={net.url.startsWith('http') ? 'noopener noreferrer' : undefined}
										className='group inline-flex items-center gap-1.5 text-muted-foreground hover:text-signal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal rounded py-1'>
										<span className='text-foreground group-hover:text-signal transition-colors font-medium'>
											{net.label}
										</span>
										<SignalArrow
											size={11}
											className='transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-muted-foreground/60 group-hover:text-signal'
										/>
									</a>
								</li>
							))}
						</ul>
					</div>

					{/* Column 4: Dossier & Dispatch Actions (3 cols) */}
					<div className='lg:col-span-3 space-y-4'>
						<div className='font-mono text-xs uppercase tracking-widest text-signal font-semibold'>
							CURRICULUM VITAE
						</div>

						<div className='p-4 sm:p-5 rounded-xl border border-border/80 bg-surface/50 space-y-4'>
							<p className='text-xs text-muted-foreground leading-relaxed'>
								Authoritative 2026 engineering dossier with verified technical credentials,
								production metrics, and leadership milestones.
							</p>

							<div className='space-y-2.5'>
								<a
									href='/resume/koushikpuppala_resume.pdf'
									download='Koushik_Puppala_Resume.pdf'
									className='group flex w-full items-center justify-center gap-2 px-4 py-3 sm:py-2.5 rounded-lg bg-signal text-signal-foreground font-mono text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:opacity-90 active:scale-[0.98] shadow-md shadow-signal/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal'>
									<svg
										className='w-3.5 h-3.5'
										aria-hidden='true'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'>
										<path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
										<polyline points='7 10 12 15 17 10' />
										<line x1='12' y1='15' x2='12' y2='3' />
									</svg>
									<span>RESUME (PDF • 207 KB)</span>
									<SignalArrow
										size={11}
										className='transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
									/>
								</a>

								<Link
									href='/contact'
									className='group flex w-full items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-lg border border-border/70 bg-surface hover:bg-surface-strong hover:text-foreground text-muted-foreground font-mono text-xs font-medium uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal'>
									<span>TRANSMIT MESSAGE</span>
									<SignalArrow
										size={11}
										className='transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
									/>
								</Link>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom Sub-Bar: Copyright, Telemetry, and Back to Top */}
				<div className='border-t border-border/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono'>
					<div className='flex flex-wrap items-center justify-center sm:justify-start gap-2 text-muted-foreground text-center sm:text-left'>
						<span>KOUSHIK PUPPALA © {currentYear}</span>
						<span className='text-border-strong'>•</span>
						<span className='text-foreground font-medium'>ALL SYSTEMS NOMINAL</span>
						<span className='hidden md:inline-block text-border-strong'>•</span>
						<span className='hidden md:inline-block'>NEXT.JS 16 {'//'} NESTJS 11</span>
					</div>

					<div className='flex items-center gap-4 sm:gap-6 text-muted-foreground'>
						<span className='hidden sm:inline-block text-[11px] hover:text-foreground transition-colors'>
							ACCESSIBILITY: WCAG AA
						</span>
						<span className='hidden sm:inline-block text-[11px] hover:text-foreground transition-colors'>
							MOTION: REDUCED-READY
						</span>
						<BackToTop />
					</div>
				</div>
			</PageContainer>
		</footer>
	)
}
