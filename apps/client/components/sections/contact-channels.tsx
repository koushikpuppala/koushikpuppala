'use client'

import { useState } from 'react'
import { Surface } from 'ui/surface'
import { SignalArrow } from 'ui/motion'
import { DIRECT_CHANNELS, CONTACT_TELEMETRY, type DirectChannel } from '../../lib/contact-data'
import { socialsToDirectChannels, type PortfolioSocial } from '../../lib/social-data'

export interface ContactChannelsProps {
	className?: string
	channels?: DirectChannel[]
	socials?: PortfolioSocial[]
}

export const ContactChannels = ({ className, channels, socials }: ContactChannelsProps) => {
	const [copied, setCopied] = useState(false)

	const activeChannels =
		channels && channels.length > 0
			? channels
			: socials && socials.length > 0
				? socialsToDirectChannels(socials)
				: DIRECT_CHANNELS

	const handleCopyEmail = async (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		try {
			await navigator.clipboard.writeText('koushikpuppala@koushikpuppala.com')
			setCopied(true)
			setTimeout(() => setCopied(false), 2200)
		} catch {
			// Fallback if clipboard API is restricted
		}
	}

	return (
		<Surface
			variant='bordered'
			className={`p-4 sm:p-8 rounded-xl sm:rounded-2xl border border-border/80 bg-surface/60 backdrop-blur-md space-y-6 sm:space-y-8 ${
				className || ''
			}`}>
			{/* Channels Header & Status Pulse */}
			<div className='space-y-3 border-b border-border/60 pb-6'>
				<div className='flex items-center gap-2.5'>
					<span className='relative flex h-2 w-2 shrink-0'>
						<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75' />
						<span className='relative inline-flex rounded-full h-2 w-2 bg-signal' />
					</span>
					<span className='font-mono text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest text-signal font-semibold break-words'>
						DIRECT CHANNELS {'//'} VERIFIED
					</span>
				</div>

				<h3 className='text-xl sm:text-3xl font-display font-semibold tracking-tight text-foreground break-words'>
					Let&apos;s build scalable systems together.
				</h3>

				<p className='text-sm text-muted-foreground leading-relaxed'>
					Whether you&apos;re architecting high-throughput services, planning a monorepo
					modernization, or exploring technical leadership, my transmission channels are open.
				</p>
			</div>

			{/* Interactive Communication Channels */}
			<ul className='space-y-3 list-none p-0 m-0' aria-label='Direct communication channels'>
				{activeChannels.map((ch: DirectChannel) => (
					<li
						key={ch.id}
						className='group relative rounded-xl border border-border/70 bg-surface-strong/30 hover:border-signal/50 hover:bg-surface-strong/60 hover:translate-x-0.5 transition-all duration-200 p-3.5 sm:p-4'>
						<div className='flex items-center justify-between gap-3'>
							{/* Channel Icon & Text Info */}
							<a
								href={ch.url}
								target={ch.type === 'link' ? '_blank' : undefined}
								rel={ch.type === 'link' ? 'noopener noreferrer' : undefined}
								className='flex items-center gap-3.5 min-w-0 flex-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal rounded-lg'>
								{/* Icon Badge */}
								<div className='shrink-0 h-10 w-10 rounded-lg border border-border/80 bg-surface flex items-center justify-center text-muted-foreground group-hover:border-signal/40 group-hover:text-signal transition-colors'>
									{ch.id === 'email' && (
										<svg
											className='h-4 w-4'
											aria-hidden='true'
											viewBox='0 0 24 24'
											fill='none'
											stroke='currentColor'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'>
											<rect width='20' height='16' x='2' y='4' rx='2' />
											<path d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7' />
										</svg>
									)}
									{ch.id === 'linkedin' && (
										<svg
											className='h-4 w-4'
											aria-hidden='true'
											viewBox='0 0 24 24'
											fill='none'
											stroke='currentColor'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'>
											<path d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z' />
											<rect width='4' height='12' x='2' y='9' />
											<circle cx='4' cy='4' r='2' />
										</svg>
									)}
									{ch.id === 'github' && (
										<svg
											className='h-4 w-4'
											aria-hidden='true'
											viewBox='0 0 24 24'
											fill='none'
											stroke='currentColor'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'>
											<path d='M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4' />
											<path d='M9 18c-4.51 2-5-2-7-2' />
										</svg>
									)}
									{ch.id === 'discord' && (
										<svg
											className='h-4 w-4'
											aria-hidden='true'
											viewBox='0 0 24 24'
											fill='none'
											stroke='currentColor'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'>
											<circle cx='9' cy='12' r='1' />
											<circle cx='15' cy='12' r='1' />
											<path d='M7.5 7.5c3.5-1 5.5-1 9 0 1 2 2 6 2 9-1.5 1-3.5 1.5-5 1.5l-.5-1.5c-1 .2-2 .2-3 0l-.5 1.5c-1.5 0-3.5-.5-5-1.5 0-3 1-7 2-9Z' />
										</svg>
									)}
								</div>

								<div className='min-w-0 flex-1'>
									<div className='font-mono text-[10px] uppercase tracking-wider text-muted-foreground'>
										{ch.label}
									</div>
									<div className='font-mono text-xs sm:text-sm font-medium text-foreground truncate group-hover:text-signal transition-colors'>
										{ch.handle}
									</div>
								</div>
							</a>

							{/* Actions: Copy for Email or External Arrow */}
							<div className='shrink-0 flex items-center gap-2'>
								{ch.id === 'email' ? (
									<button
										type='button'
										onClick={handleCopyEmail}
										title='Copy email to clipboard'
										className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border/80 bg-surface hover:bg-surface-strong hover:text-signal text-muted-foreground font-mono text-[10px] uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal'>
										{copied ? (
											<span className='text-signal font-semibold'>COPIED!</span>
										) : (
											<>
												<svg
													className='w-3 h-3'
													aria-hidden='true'
													viewBox='0 0 24 24'
													fill='none'
													stroke='currentColor'
													strokeWidth='2'
													strokeLinecap='round'
													strokeLinejoin='round'>
													<rect width='14' height='14' x='8' y='8' rx='2' ry='2' />
													<path d='M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' />
												</svg>
												<span>COPY</span>
											</>
										)}
									</button>
								) : (
									<a
										href={ch.url}
										target='_blank'
										rel='noopener noreferrer'
										className='p-1.5 text-muted-foreground hover:text-signal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal rounded'
										aria-label={`Open ${ch.label} in a new tab`}>
										<SignalArrow
											size={13}
											className='transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5'
										/>
									</a>
								)}
							</div>
						</div>
					</li>
				))}
			</ul>

			{/* Telemetry & Availability Matrix */}
			<div className='p-4 rounded-xl border border-border/60 bg-surface-strong/20 space-y-3 text-xs'>
				<div className='flex items-center justify-between text-muted-foreground font-mono text-[11px]'>
					<span className='uppercase tracking-wider'>RESPONSE SLA</span>
					<span className='text-foreground font-medium'>{CONTACT_TELEMETRY.responseTime}</span>
				</div>
				<div className='flex items-center justify-between text-muted-foreground font-mono text-[11px]'>
					<span className='uppercase tracking-wider'>LOCATION BASE</span>
					<span className='text-foreground font-medium'>{CONTACT_TELEMETRY.location}</span>
				</div>
				<div className='flex items-center justify-between text-muted-foreground font-mono text-[11px]'>
					<span className='uppercase tracking-wider'>SECURITY TRANSPORT</span>
					<span className='text-signal font-medium'>{CONTACT_TELEMETRY.encryption}</span>
				</div>

				<div className='pt-2 border-t border-border/50 flex items-center gap-2 text-muted-foreground font-mono text-[10px]'>
					<span className='h-1.5 w-1.5 rounded-full bg-signal shrink-0' aria-hidden='true' />
					<span>{CONTACT_TELEMETRY.status}</span>
				</div>
			</div>
		</Surface>
	)
}
