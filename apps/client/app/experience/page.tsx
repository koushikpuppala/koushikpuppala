import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from '@/components/icons'
import { SiteShell } from '@/components/site-shell'
import { EmptyState, Reveal, Section, SectionHeader } from '@/components/primitives'
import { PageHero } from '@/components/portfolio/page-hero'
import { ExperienceTimeline } from '@/components/portfolio/experience-timeline'
import { ContactCTA } from '@/components/portfolio/home-sections'
import { Button } from '@/components/ui/button'
import { getExperience, getSocials } from '@/lib/portfolio-data'
import { formatYear } from '@/lib/format'

export const metadata: Metadata = {
	title: 'Experience',
	description:
		'Professional timeline of Koushik Puppala: full stack development at Earnest Data Analytics, engineering internships and university team leadership.',
	openGraph: {
		title: 'Experience — Koushik Puppala',
		description: 'Full stack roles, internships and team leadership.',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
	},
}

export default async function ExperiencePage() {
	const [experiences, socials] = await Promise.all([getExperience(), getSocials()])

	const email = socials.find(social => social.platform === 'mail')?.handle ?? null
	const current = experiences.find(item => !item.endDate)
	const organizations = new Set(experiences.map(item => item.organization)).size
	const earliest = experiences.reduce<string | null>(
		(acc, item) => (!acc || item.startDate < acc ? item.startDate : acc),
		null,
	)

	return (
		<SiteShell socials={socials}>
			<PageHero
				eyebrow='Experience'
				title='Roles, internships and teams'
				lines={['Roles, internships', 'and teams']}
				lead="A full record of where I've shipped — product engineering, infrastructure work and the university platform I helped lead."
				meta={[current ? `Now · ${current.organization}` : 'India', 'India']}
				actions={
					<>
						<Button asChild size='lg' variant='signal' className='group'>
							<Link href='/projects'>
								See the work <ArrowRight className='arrow-slide size-4' />
							</Link>
						</Button>
						<Button asChild size='lg' variant='outline'>
							<Link href='/resume'>Resume</Link>
						</Button>
					</>
				}
			/>

			<Section className='pt-14 lg:pt-16'>
				<div className='container-page'>
					<Reveal className='grid gap-px overflow-hidden border-y border-border bg-border sm:grid-cols-3'>
						{[
							{ label: 'Positions', value: String(experiences.length) },
							{ label: 'Organizations', value: String(organizations) },
							{ label: 'Since', value: earliest ? formatYear(earliest) : '—' },
						].map(stat => (
							<div key={stat.label} className='bg-background px-6 py-7'>
								<p className='text-eyebrow'>{stat.label}</p>
								<p className='font-display numeric mt-3 text-3xl font-medium tracking-tight'>
									{stat.value}
								</p>
							</div>
						))}
					</Reveal>

					{experiences.length === 0 ? (
						<EmptyState
							title='No experience published yet'
							description='The timeline will appear here once entries are published.'
						/>
					) : (
						<div className='mt-16 lg:mt-20'>
							<SectionHeader
								index='01'
								eyebrow='Timeline'
								title="Where I've shipped"
								size='md'
								titleId='timeline-title'
							/>
							<div className='mt-12'>
								<ExperienceTimeline items={experiences} />
							</div>
						</div>
					)}
				</div>
			</Section>

			<ContactCTA socials={socials} email={email} />
		</SiteShell>
	)
}
