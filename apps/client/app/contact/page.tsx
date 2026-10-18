import type { Metadata } from 'next'
import { ReCaptchaProvider } from 'next-recaptcha-v3'
import { ContactView } from 'components/contact/contact-view'
import { getSocialsData } from 'lib/social-data'
import { getAboutData } from 'lib/about-data'
import { resolveMetadataByPath } from 'lib/metadata-data'

export const generateMetadata = async (): Promise<Metadata> => {
	'use cache'
	return resolveMetadataByPath('/contact')
}

const ContactPage = async () => {
	const [socials, about] = await Promise.all([getSocialsData(), getAboutData()])

	return (
		<ReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
			<ContactView socials={socials} location={about.location} />
		</ReCaptchaProvider>
	)
}

export default ContactPage
