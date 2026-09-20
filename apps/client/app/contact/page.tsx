import type { Metadata } from 'next'
import { ContactView } from 'components/contact/contact-view'
import { getSocialsData } from 'lib/social-data'

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
	const socials = await getSocialsData()

	return <ContactView socials={socials} />
}
