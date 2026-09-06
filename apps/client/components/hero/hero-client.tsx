'use client'

import Link from 'next/link'
import { PageContainer } from 'ui/container'
import { DisplayHero, TechnicalLabel, MonoMeta, BodyText } from 'ui/typography'
import { SignalRule } from 'ui/brand'
import { PageEntrance, MaskedText, SignalArrow } from 'ui/motion'
import { BrandOrbit } from './brand-orbit'
import { HeroMetaStrip } from './hero-meta-strip'
import { classNames } from '../../lib/utils'
import { AUTHORITATIVE_HOME, type PortfolioHome } from '../../lib/home-data'
import { AUTHORITATIVE_SOCIALS, type PortfolioSocial } from '../../lib/social-data'

export type HeroClientViewProps = {
	className?: string
	homeData?: PortfolioHome
	socials?: PortfolioSocial[]
}

/**
 * HeroClientView
 * Client-side interactive layer of the Lovable Signal Hero section.
 */
export const HeroClientView = ({ className, homeData, socials }: HeroClientViewProps) => {
	const data = homeData || AUTHORITATIVE_HOME
	const activeSocials = socials && socials.length > 0 ? socials : AUTHORITATIVE_SOCIALS

	return (
		<section
			aria-label='Hero Section'
			className={classNames(
				'relative w-full overflow-hidden pb-16 sm:pb-24 pt-6 sm:pt-10',
				className,
			)}>
			<PageContainer>
				{/* Main Hero Split Grid: Editorial Content (Left) + Brand Orbit (Right) */}
				<div className='grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center'>
					{/* Left Column: Heading, Role, Intro, CTAs */}
					<div className='lg:col-span-7 flex flex-col justify-center space-y-6 sm:space-y-8'>
						<PageEntrance delay={0.05}>
							{/* Status / Availability Row */}
							<div className='flex flex-wrap items-center gap-3'>
								<div className='inline-flex items-center gap-2 rounded-full border border-status-live/40 bg-status-live-soft px-3 py-1 text-xs font-mono text-status-live'>
									<span
										className='h-1.5 w-1.5 rounded-full bg-status-live animate-pulse'
										aria-hidden='true'
									/>
									<span className='tracking-wider font-semibold uppercase'>AVAILABLE FOR WORK</span>
								</div>

								<span className='text-border-strong hidden sm:inline'>/</span>

								<TechnicalLabel dot variant='signal'>
									SYS.LIVE {'//'} FULL-STACK ARCHITECT
								</TechnicalLabel>
							</div>
						</PageEntrance>

						{/* Main Editorial Hero Headline */}
						<div className='space-y-2'>
							<MaskedText delay={0.15}>
								<DisplayHero className='text-4xl sm:text-6xl md:text-[88px] lg:text-[100px] xl:text-[112px] break-words'>
									{data.title.split(' ')[0] || 'KOUSHIK'} <br />
									<span className='text-foreground'>
										{data.title.split(' ').slice(1).join(' ') || 'PUPPALA'}
									</span>
									<span className='text-signal'>.</span>
								</DisplayHero>
							</MaskedText>

							{/* Role & Title Presentation */}
							<PageEntrance delay={0.25}>
								<h2 className='font-display font-medium text-lg sm:text-2xl md:text-3xl text-foreground/90 tracking-tight pt-2 break-words'>
									{data.subtitles[0] || 'Senior Full-Stack & AI Systems Engineer'}
								</h2>
							</PageEntrance>
						</div>

						{/* Narrative Introduction */}
						<PageEntrance delay={0.35}>
							<BodyText className='max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed'>
								{data.content}
							</BodyText>
						</PageEntrance>

						{/* Action Buttons: Primary CTA, Contact, and Resume */}
						<PageEntrance delay={0.45}>
							<div className='flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2'>
								{/* Primary Work CTA */}
								<Link
									href={
										data.ctaUrl?.startsWith('#') ? `/${data.ctaUrl}` : data.ctaUrl || '/#projects'
									}
									className='group inline-flex items-center justify-center gap-2.5 rounded-full bg-signal px-5 py-3 sm:py-2.5 font-mono text-xs sm:text-sm font-semibold text-white shadow-[0_0_24px_rgba(255,51,102,0.35)] transition-all duration-200 hover:bg-signal-hover hover:shadow-[0_0_32px_rgba(255,51,102,0.5)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2'>
									<span>{data.ctaLabel || 'Explore Selected Work'}</span>
									<SignalArrow
										size={14}
										className='transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5'
									/>
								</Link>

								{/* Secondary Contact Action */}
								<Link
									href={
										data.secondaryCtaUrl?.startsWith('#')
											? `/${data.secondaryCtaUrl}`
											: data.secondaryCtaUrl || '/contact'
									}
									className='inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-3 sm:py-2.5 font-mono text-xs sm:text-sm text-foreground transition-all duration-200 hover:border-signal/40 hover:bg-surface-strong active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal'>
									<span>{data.secondaryCtaLabel || 'Get in Touch'}</span>
								</Link>

								{/* Resume Link */}
								<Link
									href='/resume'
									className='inline-flex items-center justify-center gap-2 rounded-full border border-border/80 bg-surface/60 px-4 py-3 sm:py-2.5 font-mono text-xs sm:text-sm text-muted-foreground transition-all duration-200 hover:text-foreground hover:border-border-strong active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal'>
									<span>Resume (PDF)</span>
								</Link>
							</div>

							{/* Social Links Row */}
							<div className='flex flex-wrap items-center gap-4 pt-6'>
								<MonoMeta className='text-xs uppercase tracking-widest text-muted-foreground font-semibold'>
									CONNECT {'//'}
								</MonoMeta>
								{activeSocials.map(s => (
									<a
										key={s.id}
										href={s.url}
										target='_blank'
										rel='noopener noreferrer'
										className='font-mono text-xs text-muted-foreground hover:text-signal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal'>
										{s.label}
									</a>
								))}
							</div>
						</PageEntrance>
					</div>

					{/* Right Column: Technical Brand Orbit Visual */}
					<div className='lg:col-span-5 flex items-center justify-center lg:justify-end'>
						<PageEntrance delay={0.2}>
							<BrandOrbit />
						</PageEntrance>
					</div>
				</div>

				{/* Horizontal Signal Rule Divider */}
				<div className='pt-12 sm:pt-16 pb-8'>
					<SignalRule variant='centered' />
				</div>

				{/* Hero Metadata Strip */}
				<PageEntrance delay={0.5}>
					<HeroMetaStrip />
				</PageEntrance>

				{/* "Selected Work" Scroll Transition Anchor */}
				<div className='flex flex-col items-center justify-center pt-12 sm:pt-16'>
					<Link
						href='/#projects'
						aria-label='Scroll to Selected Work section'
						className='group flex flex-col items-center gap-2 font-mono text-xs text-muted-foreground hover:text-signal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal rounded-md p-2'>
						<span className='uppercase tracking-[0.2em] font-medium'>SCROLL TO EXPLORE WORK</span>
						<svg
							width='16'
							height='16'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
							aria-hidden='true'
							className='transition-transform duration-300 group-hover:translate-y-1 text-signal'>
							<path d='M12 5v14' />
							<path d='m19 12-7 7-7-7' />
						</svg>
					</Link>
				</div>
			</PageContainer>
		</section>
	)
}
