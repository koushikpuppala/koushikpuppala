'use client'

import Link from 'next/link'
import { LogoGlyph } from 'components/brand/logo'
import { Chip, Magnetic, Marquee, Reveal, Spotlight } from 'components/primitives'
import {
	ArrowRight,
	ArrowUpRight,
	Discord,
	Github,
	Linkedin,
	Mail,
	Twitter,
} from 'components/icons'
import { Button } from 'components/ui/button'
import { formatMonthYear, formatYear, splitList } from 'lib/format'
import { classNames } from 'utils/classNames'
import type {
	PublishedAbout,
	PublishedEducation,
	PublishedExperience,
	PublishedService,
	PublishedSocial,
} from 'types/models'

export const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
	github: Github,
	linkedin: Linkedin,
	x: Twitter,
	gmail: Mail,
	discord: Discord,
}

const MetaRow = ({ label, value }: { label: string; value: string }) => {
	return (
		<div className='border-border grid grid-cols-[6.5rem_minmax(0,1fr)] items-baseline gap-3 border-t py-3 first:border-t-0'>
			<dt className='text-muted-foreground font-mono text-[0.625rem] tracking-[0.16em] uppercase'>
				{label}
			</dt>
			<dd className='text-foreground truncate text-sm' title={value}>
				{value}
			</dd>
		</div>
	)
}

export const AboutBlock = ({
	about,
	current,
	education,
	showLink = true,
	showBio = true,
	className,
}: {
	about: PublishedAbout
	current?: PublishedExperience
	education?: PublishedEducation
	showLink?: boolean
	showBio?: boolean
	className?: string
}) => {
	const descStr = about.description || about.content || ''

	const paragraphs = descStr.split('\n').filter(Boolean)

	return (
		<div className={classNames('grid gap-12 lg:grid-cols-12 lg:gap-16', className)}>
			<div className='lg:col-span-7'>
				{showBio ? (
					<Reveal>
						<p className='font-display text-2xl leading-[1.35] font-medium tracking-tight text-balance sm:text-[1.75rem]'>
							{about.bio}
						</p>
					</Reveal>
				) : null}
				<div className={classNames('space-y-5', showBio && 'mt-8')}>
					{paragraphs.map((paragraph, i) => (
						<Reveal key={paragraph.slice(0, 24)} delay={70 + i * 55}>
							<p
								className={classNames(
									'text-muted-foreground max-w-2xl leading-[1.75]',
									!showBio && i === 0 && 'text-foreground/85 text-[1.0625rem]',
								)}>
								{paragraph}
							</p>
						</Reveal>
					))}
				</div>
				{showLink ? (
					<Reveal delay={240} className='mt-9 inline-block'>
						<Link
							href='/about'
							className='group text-foreground inline-flex items-center gap-2 text-sm font-medium'>
							<span className='link-underline'>More about how I work</span>
							<ArrowRight className='arrow-slide text-signal-ink size-4' />
						</Link>
					</Reveal>
				) : null}
			</div>

			<div className='lg:col-span-5'>
				<Reveal delay={120} from='right'>
					<Spotlight className='panel overflow-hidden rounded-2xl'>
						<div className='border-border bg-surface-strong relative grid aspect-4/3 place-items-center overflow-hidden border-b'>
							<div className='grid-micro absolute inset-0 opacity-50' aria-hidden />
							<div
								className='absolute inset-0 opacity-70'
								style={{ background: 'var(--glow-signal)' }}
								aria-hidden
							/>
							<LogoGlyph className='text-foreground relative size-[46%] drop-shadow-[0_2px_20px_color-mix(in_oklab,var(--signal)_40%,transparent)]' />
							<span className='text-muted-foreground absolute bottom-4 left-5 font-mono text-[0.625rem] tracking-[0.2em] uppercase'>
								Koushik Puppala
							</span>
						</div>
						<dl className='p-6'>
							{current ? (
								<MetaRow label='Role' value={current.role || current.title || ''} />
							) : null}
							{current ? (
								<MetaRow label='Company' value={current.organization || current.company || ''} />
							) : null}
							<MetaRow label='Based' value={current?.location ?? 'India'} />
							{education ? (
								<MetaRow
									label='Degree'
									value={`${education.degree}${education.field || education.fieldOfStudy ? ` · ${education.field || education.fieldOfStudy}` : ''}`}
								/>
							) : null}
						</dl>
					</Spotlight>
				</Reveal>
			</div>
		</div>
	)
}

export const EducationBlock = ({
	items,
	detailed = false,
	className,
}: {
	items: PublishedEducation[]
	detailed?: boolean
	className?: string
}) => {
	return (
		<div className={classNames('', className)}>
			{items.map((item, i) => (
				<Reveal key={item.id} delay={i * 60}>
					<div className='group border-border grid gap-2 border-t py-7 last:border-b sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] sm:gap-10'>
						<p className='numeric text-muted-foreground font-mono text-[0.75rem]'>
							{formatYear(item.startDate)} — {item.endDate ? formatYear(item.endDate) : 'Present'}
						</p>
						<div className='min-w-0'>
							<h3 className='font-display text-lg font-medium tracking-tight text-balance sm:text-xl'>
								{item.degree}
								{item.field ? <span className='text-muted-foreground'> · {item.field}</span> : null}
							</h3>
							<p className='text-foreground/85 mt-1.5 text-sm'>{item.institution}</p>
							{item.description ? (
								<p className='text-muted-foreground mt-1 text-sm'>{item.description}</p>
							) : null}
							{detailed && (item.grade || item.mentor) ? (
								<dl className='text-muted-foreground mt-4 flex flex-wrap gap-x-10 gap-y-2 font-mono text-[0.6875rem] tracking-[0.08em] uppercase'>
									{item.grade ? (
										<div>
											<dt className='inline'>Grade — </dt>
											<dd className='text-foreground inline'>{item.grade}</dd>
										</div>
									) : null}
									{item.mentor ? (
										<div>
											<dt className='inline'>Mentor — </dt>
											<dd className='text-foreground inline'>{item.mentor}</dd>
										</div>
									) : null}
								</dl>
							) : null}
						</div>
					</div>
				</Reveal>
			))}
		</div>
	)
}

export function TechTicker({ services }: { services: PublishedService[] }) {
	const items = services.flatMap(service => splitList(service.description))
	if (!items.length) return null

	return (
		<div className='border-border bg-surface/40 border-y py-5'>
			<Marquee speed={58}>
				{items.map((item, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: marquee duplication requires unique indexed keys
					<span key={`${item}-${i}`} className='flex items-center'>
						<span className='text-muted-foreground px-6 font-mono text-[0.8125rem] whitespace-nowrap'>
							{item}
						</span>
						<span className='bg-signal/60 size-1 rounded-full' aria-hidden />
					</span>
				))}
			</Marquee>
		</div>
	)
}

/* ------------------------------------------------------------------- CTA */

export function ContactCTA({
	socials,
	email,
}: {
	socials: PublishedSocial[]
	email?: string | null
}) {
	return (
		<div className='border-border relative isolate overflow-hidden border-t'>
			<div className='mesh-bloom pointer-events-none absolute inset-0 -z-10' aria-hidden />
			<div className='grid-fine mask-fade-t pointer-events-none absolute inset-0 -z-10 opacity-60' />
			<LogoGlyph
				className='mark-watermark absolute -top-20 -right-24 -z-10 hidden size-136 opacity-[0.07] saturate-[0.6] md:block'
				aria-hidden
			/>

			<div className='container-page py-20 sm:py-28 lg:py-32'>
				<Reveal>
					<p className='text-eyebrow'>Next</p>
				</Reveal>
				<Reveal delay={70}>
					<h2 id='contact-title' className='text-display text-section mt-6 max-w-4xl text-balance'>
						Have something worth building?
					</h2>
				</Reveal>
				<Reveal delay={120}>
					<p className='text-muted-foreground mt-7 max-w-xl leading-relaxed'>
						Tell me about the problem — I&apos;ll reply with how I&apos;d approach it, what I&apos;d
						build first, and what I&apos;d need from you.
					</p>
				</Reveal>

				<Reveal delay={170}>
					<div className='mt-10 flex flex-wrap items-center gap-4'>
						<Magnetic>
							<Button asChild size='xl' variant='signal' className='group'>
								<Link href='/contact'>
									Start a conversation
									<ArrowRight className='arrow-slide size-4' />
								</Link>
							</Button>
						</Magnetic>
						<Magnetic strength={0.18}>
							<Button asChild size='xl' variant='outline'>
								<Link href='/resume'>View resume</Link>
							</Button>
						</Magnetic>
					</div>
				</Reveal>

				<Reveal delay={220}>
					<div className='border-border mt-14 grid gap-8 border-t pt-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end'>
						{email ? (
							<div className='min-w-0'>
								<p className='text-eyebrow'>Direct</p>
								<a
									href={`mailto:${email}`}
									className='group font-display text-foreground mt-3 inline-flex max-w-full items-center gap-3 text-lg font-medium tracking-tight break-all sm:text-2xl'>
									<span className='link-underline'>{email}</span>
									<ArrowUpRight className='arrow-slide text-signal-ink size-4 shrink-0' />
								</a>
							</div>
						) : null}

						<div className='flex flex-wrap items-center gap-2'>
							{socials.map(social => {
								const Icon = socialIcons[social.icon ?? ''] ?? ArrowUpRight
								return (
									<a
										key={social.id}
										href={social.url}
										target='_blank'
										rel='noreferrer noopener'
										className='group border-border bg-background/50 text-muted-foreground hover:border-signal/60 hover:text-foreground inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all duration-300 hover:-translate-y-0.5'>
										<Icon className='size-4' />
										{social.label}
									</a>
								)
							})}
						</div>
					</div>
				</Reveal>
			</div>
		</div>
	)
}

export function LeadershipStrip({ experience }: { experience: PublishedExperience[] }) {
	const lead = experience.find(item => /lead|mentor/i.test(item.role || item.title || ''))
	if (!lead) return null

	return (
		<Reveal>
			<div className='border-border bg-surface/50 grid gap-6 rounded-2xl border p-7 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-9'>
				<div className='min-w-0'>
					<p className='text-eyebrow'>Leadership</p>
					<h3 className='font-display mt-3 text-xl font-medium tracking-tight text-balance sm:text-2xl'>
						{lead.role || lead.title} · {lead.organization || lead.company}
					</h3>
					<p className='text-muted-foreground mt-2 text-sm'>
						{formatMonthYear(lead.startDate, '—')} — {formatMonthYear(lead.endDate)}
						{lead.location ? ` · ${lead.location}` : ''}
					</p>
				</div>
				<div className='flex flex-wrap gap-1.5'>
					{lead.technologies.slice(0, 4).map(tech => (
						<Chip key={tech} tone='outline'>
							{tech}
						</Chip>
					))}
				</div>
			</div>
		</Reveal>
	)
}
