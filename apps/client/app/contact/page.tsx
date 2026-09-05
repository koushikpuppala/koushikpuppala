import type { Metadata } from 'next'
import Link from 'next/link'
import { PageEntrance } from 'ui/motion'
import { ContactSection } from '../../components/sections/contact-section'
import { PublicFooter } from '../../components/footer'

import { getPageMetadata } from '../../lib/metadata-data'

export const metadata: Metadata = getPageMetadata('contact')

export default function ContactPage() {
	return (
		<main className='min-h-screen bg-background text-foreground flex flex-col pt-24 sm:pt-28'>
			{/* Sub Navigation & Status Bar */}
			<div className='w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-2 flex items-center justify-between'>
				<Link
					href='/'
					className='inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-signal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal rounded py-1'>
					<span aria-hidden='true'>←</span>
					<span>RETURN TO PORTFOLIO</span>
				</Link>

				<div className='flex items-center gap-2'>
					<span className='h-2 w-2 rounded-full bg-signal animate-pulse' aria-hidden='true' />
					<span className='font-mono text-xs text-signal font-medium'>CHANNELS ACTIVE</span>
				</div>
			</div>

			{/* Contact Section View */}
			<PageEntrance delay={0.05} className='flex-1 w-full'>
				<ContactSection />
			</PageEntrance>

			{/* Site Footer */}
			<PublicFooter />
		</main>
	)
}
