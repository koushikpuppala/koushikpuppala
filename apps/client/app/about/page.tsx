import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'components/icons'
import { SiteShell } from 'components/site-shell'
import { Section, SectionHeader } from 'components/primitives/layout'
import { Reveal } from 'components/primitives/motion'
import { PageHero } from 'components/home/page-hero'
import { AboutBlock, ContactCTA } from 'components/home/home-sections'
import { Button } from 'ui/button'
import { getAboutData } from 'lib/about-data'
import { getExperienceData } from 'lib/experience-data'
import { getEducationData } from 'lib/education-data'
import { getSocialsData } from 'lib/social-data'
import { resolveMetadataByPath } from 'lib/metadata-data'
import { JsonLd } from 'components/json-ld'
import { buildPageGraph, buildPerson } from 'lib/structured-data'
import { emailAddress } from 'lib/email'

export const generateMetadata = async (): Promise<Metadata> => {
	'use cache'
	return resolveMetadataByPath('/about')
}

const AboutPage = async () => {
	const [about, experience, education, socials] = await Promise.all([
		getAboutData(),
		getExperienceData(),
		getEducationData(),
		getSocialsData(),
	])

	const current = experience.find(item => item.isCurrent || !item.endDate) ?? experience[0]
	const email = emailAddress(socials)

	return (
		<SiteShell socials={socials}>
			<JsonLd
				data={buildPageGraph({
					path: '/about',
					type: 'AboutPage',
					name: 'About',
					dateModified: about.updatedAt,
					person: buildPerson({ about, experience, education, socials }),
				})}
			/>

			<PageHero
				eyebrow='About'
				title={about.title || 'About'}
				lead={about.leadStatement || about.biography}
				meta={[current?.title ?? '', current?.location ?? ''].filter(Boolean)}
				actions={
					<>
						<Button asChild size='lg' variant='signal' className='group'>
							<Link href='/experience'>
								See the timeline <ArrowRight className='arrow-slide size-4' />
							</Link>
						</Button>
						<Button asChild size='lg' variant='outline' className='group'>
							<Link href='/resume'>Resume</Link>
						</Button>
					</>
				}
			/>

			<Section className='pt-16 lg:pt-20'>
				<div className='container-page'>
					<AboutBlock
						about={about}
						current={current}
						education={education[0]}
						showLink={false}
						showBio={false}
					/>
				</div>
			</Section>

			{about.highlights.length ? (
				<Section className='border-border border-t pt-16 lg:pt-20'>
					<div className='container-page'>
						<SectionHeader
							index='01'
							eyebrow='Focus'
							title='How I work'
							size='md'
							titleId='focus-title'
							action={
								<Button asChild variant='ghost' className='group'>
									<Link href='/services'>
										Skills in detail <ArrowRight className='arrow-slide size-4' />
									</Link>
								</Button>
							}
						/>
						<ol className='border-border bg-border mt-12 grid gap-px overflow-hidden border-y sm:grid-cols-2'>
							{about.highlights.map((highlight, i) => (
								<Reveal key={highlight} delay={i * 55} as='li' className='bg-background'>
									<div className='group hover:bg-surface h-full p-7 transition-colors duration-500 sm:p-9'>
										<span className='text-signal-ink font-mono text-[0.6875rem]'>
											{String(i + 1).padStart(2, '0')}
										</span>
										<p className='text-foreground/90 mt-4 leading-relaxed'>{highlight}</p>
									</div>
								</Reveal>
							))}
						</ol>
					</div>
				</Section>
			) : null}

			<ContactCTA socials={socials} email={email} />
		</SiteShell>
	)
}

export default AboutPage
