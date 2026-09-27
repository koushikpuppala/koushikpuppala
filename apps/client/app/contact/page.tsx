import type { Metadata } from 'next'
import { ContactView } from 'components/contact/contact-view'
import { getSocialsData } from 'lib/social-data'
import { resolveMetadataByPath } from 'lib/metadata-data'

export const generateMetadata = async (): Promise<Metadata> => {
	return resolveMetadataByPath('/contact')
}

export default async function ContactPage() {
	const socials = await getSocialsData()

	return <ContactView socials={socials} />
}
