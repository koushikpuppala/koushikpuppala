import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from '@/components/icons'
import { SiteShell } from '@/components/site-shell'
import { EmptyState, Section, SectionHeader } from '@/components/primitives'
import { PageHero } from '@/components/portfolio/page-hero'
import { StackClusters } from '@/components/portfolio/stack-clusters'
import { ContactCTA, TechTicker } from '@/components/portfolio/home-sections'
import { Button } from '@/components/ui/button'
import { splitList } from '@/lib/format'
import { getServices, getSocials } from '@/lib/portfolio-data'

export const metadata: Metadata = {
	title: 'Skills',
	description:
		'Frontend, backend, database, cloud and DevOps, engineering and tooling skills — React, Next.js, TypeScript, Node.js, PostgreSQL, AWS and Docker.',
	openGraph: {
		title: 'Skills — Koushik Puppala',
		description: 'Frontend, backend, database, cloud and DevOps skills.',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
	},
}

export default async function ServicesPage() {
	const [services, socials] = await Promise.all([getServices(), getSocials()])

	const email = socials.find(social => social.platform === 'mail')?.handle ?? null
	const total = services.reduce((acc, service) => acc + splitList(service.description).length, 0)

	return (
		<SiteShell socials={socials}>
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
