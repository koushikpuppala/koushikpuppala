import type { Metadata } from 'next'
import { ReCaptchaProvider } from 'next-recaptcha-v3'
import { ContactView } from 'components/contact/contact-view'
import { getSocialsData } from 'lib/social-data'
import { getAboutData } from 'lib/about-data'
import { resolveMetadataByPath } from 'lib/metadata-data'
import { JsonLd } from 'components/json-ld'
import { buildPageGraph, buildPerson } from 'lib/structured-data'

export const generateMetadata = async (): Promise<Metadata> => {
	'use cache'
	return resolveMetadataByPath('/contact')
}

const ContactPage = async () => {
	const [socials, about] = await Promise.all([getSocialsData(), getAboutData()])

	return (
		<>
			<JsonLd
				data={buildPageGraph({
					path: '/contact',
					type: 'ContactPage',
					name: 'Contact',
					person: buildPerson({ about, socials }),
				})}
			/>
			<ReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
				<ContactView socials={socials} location={about.location} />
			</ReCaptchaProvider>
		</>
	)
}

export default ContactPage
