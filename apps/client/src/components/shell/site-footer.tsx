import type { SiteFooterProps } from 'types/components/client'
import Link from 'next/link'
import { LogoGlyph } from 'components/brand/logo'
import { PulseDot } from 'components/primitives/layout'
import { navItems } from 'components/shell/navigation'
import { WordMark } from 'components/shell/word-mark'

export const SiteFooter = ({ socials }: SiteFooterProps) => {
	return (
		<footer className='border-border bg-surface/50 relative overflow-hidden border-t'>
			<div className='grid-fine pointer-events-none absolute inset-0 opacity-40' aria-hidden />
			<LogoGlyph
				className='mark-watermark absolute -right-16 -bottom-24 hidden size-120 opacity-[0.07] saturate-[0.6] lg:block'
				aria-hidden
			/>
			<div className='container-page relative py-16 md:py-20'>
				<div className='grid gap-12 lg:grid-cols-[1.3fr_2fr]'>
					<div className='max-w-sm space-y-5'>
						<WordMark />
						<p className='text-muted-foreground text-sm leading-relaxed'>
							Full Stack Developer building end-to-end web features with React, Next.js, Node.js and
							PostgreSQL — with a bias for performance and clean architecture.
						</p>
						<p className='text-muted-foreground flex items-center gap-2.5 font-mono text-[0.6875rem] tracking-tight'>
							<PulseDot />
							Open to conversations
						</p>
					</div>

					<div className='grid grid-cols-2 gap-8 sm:grid-cols-3'>
						<div>
							<p className='text-eyebrow mb-4'>Explore</p>
							<ul className='space-y-2.5 text-sm'>
								{navItems.map(item => (
									<li key={item.href}>
										<Link
											href={item.href}
											className='link-underline text-muted-foreground hover:text-foreground transition-colors'>
											{item.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
						<div>
							<p className='text-eyebrow mb-4'>Elsewhere</p>
							<ul className='space-y-2.5 text-sm'>
								{socials.map(social => (
									<li key={social.id}>
										<Link
											href={social.url}
											target='_blank'
											rel='noreferrer noopener'
											className='link-underline text-muted-foreground hover:text-foreground transition-colors'>
											{social.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
						<div>
							<p className='text-eyebrow mb-4'>Direct</p>
							<ul className='space-y-2.5 text-sm'>
								<li>
									<Link
										href='/contact'
										className='link-underline text-muted-foreground hover:text-foreground transition-colors'>
										Contact form
									</Link>
								</li>
								<li>
									<Link
										href='/resume'
										className='link-underline text-muted-foreground hover:text-foreground transition-colors'>
										Resume
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			<div className='border-border relative border-t'>
				<div className='container-page text-muted-foreground flex flex-col gap-2 py-5 font-mono text-[0.6875rem] tracking-tight sm:flex-row sm:items-center sm:justify-between'>
					<span>© 2026 Koushik Puppala</span>
					<span className='flex items-center gap-4'>
						<span>India</span>
						<span aria-hidden className='text-signal-ink'>
							{'//'}
						</span>
						<span>koushikpuppala.com</span>
					</span>
				</div>
			</div>
		</footer>
	)
}
