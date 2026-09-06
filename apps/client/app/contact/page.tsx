import type { Metadata } from 'next'
import { ContactView } from '@/components/portfolio/contact-view'
import { getSocials } from '@/lib/portfolio-data'

export const metadata: Metadata = {
	title: 'Contact',
	description:
		'Get in touch with Koushik Puppala, Full Stack Developer in India, about engineering work and collaborations.',
	openGraph: {
		title: 'Contact — Koushik Puppala',
		description: 'Get in touch about engineering work and collaborations.',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
	},
}

export default async function ContactPage() {
	const socials = await getSocials()

	return <ContactView socials={socials} />
}
