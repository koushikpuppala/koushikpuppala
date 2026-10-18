'use client'

import type { ContactViewProps } from 'types/components/client'
import { emailAddress } from 'lib/email'
import { SiteShell } from 'components/site-shell'
import { Section } from 'components/primitives/layout'
import { Reveal } from 'components/primitives/motion'
import { ContactForm } from './contact-form'
import { ContactIntro } from './contact-intro'
import { useContactForm } from './use-contact-form'
import { ContactReceiptCard } from './contact-receipt'

export const ContactView = ({ socials, location }: ContactViewProps) => {
	const form = useContactForm()

	return (
		<SiteShell socials={socials}>
			<Section className='relative overflow-hidden pt-28 pb-24 sm:pt-32 lg:pt-36 lg:pb-32'>
				<div
					className='grid-fine mask-fade-b pointer-events-none absolute inset-0 opacity-60'
					aria-hidden
				/>
				<div
					className='pointer-events-none absolute -top-52 -left-32 size-136 rounded-full opacity-60 blur-3xl'
					style={{ background: 'var(--glow-signal)' }}
					aria-hidden
				/>

				<div className='container-page relative grid gap-14 lg:grid-cols-12 lg:gap-16'>
					<ContactIntro socials={socials} location={location} />

					<div className='lg:col-span-7'>
						<Reveal delay={80} from='right'>
							{form.receipt ? (
								<ContactReceiptCard receipt={form.receipt} onReset={form.reset} />
							) : (
								<ContactForm form={form} directEmail={emailAddress(socials)} />
							)}
						</Reveal>
					</div>
				</div>
			</Section>
		</SiteShell>
	)
}
