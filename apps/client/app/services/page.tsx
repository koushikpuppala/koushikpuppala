import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'components/icons'
import { SiteShell } from 'components/site-shell'
import { EmptyState } from 'components/primitives/feedback'
import { Section, SectionHeader } from 'components/primitives/layout'
import { PageHero } from 'components/home/page-hero'
import { StackClusters } from 'components/portfolio/stack-clusters'
import { ContactCTA, TechTicker } from 'components/home/home-sections'
import { Button } from 'ui/button'
import { getServicesData } from 'lib/skills-data'
import { getSocialsData } from 'lib/social-data'
import { resolveMetadataByPath } from 'lib/metadata-data'
import { JsonLd } from 'components/json-ld'
import { buildPageGraph, buildPerson, buildServiceList } from 'lib/structured-data'
import { emailAddress } from 'lib/email'

export const generateMetadata = async (): Promise<Metadata> => {
	'use cache'
	return resolveMetadataByPath('/services')
}

const ServicesPage = async () => {
	const [services, socials] = await Promise.all([getServicesData(), getSocialsData()])

	const email = emailAddress(socials)
	const total = services.reduce((acc, service) => acc + service.features.length, 0)

	return (
		<SiteShell socials={socials}>
			<JsonLd
				data={buildPageGraph({
					path: '/services',
					type: 'CollectionPage',
					name: 'Services',
					person: buildPerson({ services, socials }),
					mainEntity: buildServiceList(services),
				})}
			/>

			<PageHero
				eyebrow='Skills'
				title='The stack I build with'
				lines={['The stack', 'I build with']}
				lead='Grouped by the layer they belong to — rendering, APIs, data, infrastructure and the practices holding them together.'
				meta={[`${services.length} groups`, `${total} technologies`]}
				actions={
					<>
						<Button asChild size='lg' variant='signal' className='group'>
							<Link href='/projects'>
								Where I use them <ArrowRight className='arrow-slide size-4' />
							</Link>
						</Button>
						<Button asChild size='lg' variant='outline'>
							<Link href='/resume'>Resume</Link>
						</Button>
					</>
				}
			/>

			<TechTicker services={services} />

			<Section className='pt-16 lg:pt-20'>
				<div className='container-page'>
					{services.length === 0 ? (
						<EmptyState title='No skills published yet' />
					) : (
						<>
							<SectionHeader index='01' eyebrow='Groups' title='By layer' size='md' />
							<StackClusters services={services} className='mt-12' />
						</>
					)}
				</div>
			</Section>

			<ContactCTA socials={socials} email={email} />
		</SiteShell>
	)
}

export default ServicesPage
