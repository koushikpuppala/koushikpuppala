import { Suspense } from 'react'
import { ScrollReveal, SignalArrow } from 'ui/motion'
import { SectionFrame } from './section-frame'
import { SectionHeader } from './section-header'
import { ContactChannels } from './contact-channels'
import { ContactForm } from './contact-form'
import {
	getVisibleSocials,
	AUTHORITATIVE_SOCIALS,
	type PortfolioSocial,
} from '../../lib/social-data'

export interface ContactSectionProps {
	className?: string
	socials?: PortfolioSocial[]
}

async function AsyncContactChannels({ socials }: { socials?: PortfolioSocial[] }) {
	const activeSocials = socials || (await getVisibleSocials())
	return <ContactChannels socials={activeSocials} />
}

/**
 * ContactSection
 * Recreates the Lovable Contact Section:
 * - Editorial SectionHeader with technical index "07 // CONTACT"
 * - Split two-column architecture:
 *   - Left: Direct communication channels (Email, LinkedIn, GitHub, Discord) + availability & SLA telemetry
 *   - Right: Interactive Dispatch Terminal form with strict validation, loading, success, and error feedback
 * - Deep connection to backend Contact endpoint
 * - Ambient bloom-bottom atmospheric glow
 * - Fully responsive across mobile, tablet, and widescreen layouts
 */
export const ContactSection = ({ className, socials }: ContactSectionProps) => {
	return (
		<SectionFrame id='contact' background='bloom-bottom' className={className}>
			<SectionHeader
				index='07'
				tag='CONTACT'
				title='Transmission & Direct Inquiries'
				description='Available for technical leadership, distributed systems engineering, and advisory roles. Initiate a direct encrypted dispatch or reach out through verified communication channels.'
				action={
					<a
						href='mailto:koushikpuppala@koushikpuppala.com'
						className='group inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-signal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal rounded'>
						<span>DIRECT DISPATCH</span>
						<SignalArrow
							size={12}
							className='transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5'
						/>
					</a>
				}
			/>

			{/* Split Layout: Verified Channels + Dispatch Terminal */}
			<ScrollReveal delay={0.1}>
				<div className='grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start'>
					{/* Direct Channels Column (5 cols) */}
					<div className='lg:col-span-5'>
						<Suspense fallback={<ContactChannels socials={socials || AUTHORITATIVE_SOCIALS} />}>
							<AsyncContactChannels socials={socials} />
						</Suspense>
					</div>

					{/* Dispatch Terminal Form Column (7 cols) */}
					<div className='lg:col-span-7'>
						<ContactForm />
					</div>
				</div>
			</ScrollReveal>
		</SectionFrame>
	)
}
