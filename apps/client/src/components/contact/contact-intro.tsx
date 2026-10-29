import type { ContactIntroProps } from 'types/components/client'
import Link from 'next/link'
import { PulseDot } from 'components/primitives/layout'
import { ArrowUpRight, MapPin, socialIcon } from 'components/icons'
import { LocalTimeCard } from 'components/contact/local-time-card'

export const ContactIntro = ({ socials, location }: ContactIntroProps) => (
	<div className='space-y-8 lg:col-span-5'>
		<div>
			<div className='enter-item text-foreground flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.16em] uppercase'>
				<PulseDot />
				Transmission Channel
			</div>
			<h1 className='text-display mt-6 text-[2.5rem] leading-[1.02] sm:text-5xl lg:text-[3.5rem]'>
				<span className='enter-item enter-delay-2 block'>Let&apos;s talk</span>
				<span className='enter-item enter-delay-3 text-muted-foreground block'>about it</span>
			</h1>
			<p className='enter-item enter-delay-4 text-muted-foreground mt-6 max-w-md leading-relaxed'>
				Whether you have a full-stack product build, an architecture challenge, or an engineering
				role — send a note and I&apos;ll get back to you with thoughtful context.
			</p>
		</div>

		<div className='enter-item enter-delay-5 border-border bg-surface/60 space-y-4 rounded-2xl border p-5 backdrop-blur-sm'>
			<LocalTimeCard />

			{location ? (
				<div className='text-muted-foreground flex items-center gap-2 pt-1 text-[0.6875rem]'>
					<MapPin className='text-signal-ink size-3.5 shrink-0' />
					<span>{location} (UTC+5:30)</span>
				</div>
			) : null}
		</div>

		<div className='enter-item enter-delay-6 space-y-2'>
			<span className='text-eyebrow block'>Verified Communication Channels</span>
			<ul className='divide-border border-border bg-surface/30 divide-y rounded-2xl border px-4'>
				{socials.map(social => {
					const Icon = socialIcon(social)

					return (
						<li key={social.id}>
							<Link
								href={social.url}
								target='_blank'
								rel='noreferrer noopener'
								className='group flex items-center gap-3.5 py-3.5 transition-colors'>
								<span className='border-border bg-background text-muted-foreground group-hover:border-signal group-hover:text-signal-ink grid size-8 shrink-0 place-items-center rounded-lg border transition-all duration-300'>
									<Icon className='size-3.5' aria-hidden focusable='false' />
								</span>
								<span className='min-w-0 flex-1'>
									<span className='text-eyebrow block text-[0.625rem]'>{social.label}</span>
									<span className='text-foreground/90 block truncate font-mono text-xs'>
										{social.handle ?? social.url}
									</span>
								</span>
								<ArrowUpRight className='text-muted-foreground group-hover:text-foreground size-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
							</Link>
						</li>
					)
				})}
			</ul>
		</div>
	</div>
)
