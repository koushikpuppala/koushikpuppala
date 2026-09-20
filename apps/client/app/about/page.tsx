import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'components/icons'
import { SiteShell } from 'components/site-shell'
import { Reveal, Section, SectionHeader } from 'components/primitives'
import { PageHero } from 'components/home/page-hero'
import { AboutBlock, ContactCTA } from 'components/home/home-sections'
import { StackClusters } from 'components/portfolio/stack-clusters'
import { Button } from 'components/ui/button'
import { getAboutData } from 'lib/about-data'
import { getExperienceData } from 'lib/experience-data'
import { getEducationData } from 'lib/education-data'
import { getServicesData } from 'lib/skills-data'
import { getSocialsData } from 'lib/social-data'

export const metadata: Metadata = {
	title: 'About',
	description:
		'Koushik Puppala is a Full Stack Developer building scalable, high-performance web applications with React, Next.js, Node.js and PostgreSQL.',
	openGraph: {
		title: 'About — Koushik Puppala',
		description:
			'Full stack development, frontend performance, clean architecture and backend integration.',
		type: 'profile',
	},
	twitter: {
		card: 'summary_large_image',
	},
}

export default async function AboutPage() {
	const [about, experience, education, services, socials] = await Promise.all([
		getAboutData(),
		getExperienceData(),
		getEducationData(),
		getServicesData(),
		getSocialsData(),
	])

	const current = experience.find(item => !item.endDate) ?? experience[0]
	const email = socials.find(social => social.platform === 'mail')?.handle ?? null

	return (
		<SiteShell socials={socials}>
			<PageHero
				eyebrow='About'
				title={about.heading || about.title || 'About'}
				lead={about.bio}
				meta={[current?.role ?? 'Full Stack Developer', current?.location ?? 'India']}
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

			<Section className='border-border border-t pt-16 lg:pt-20'>
				<div className='container-page'>
					<SectionHeader
						index='02'
						eyebrow='Stack'
						title='Tools in daily rotation'
						size='md'
						action={
							<Button asChild variant='ghost' className='group'>
								<Link href='/services'>
									Skills in detail <ArrowRight className='arrow-slide size-4' />
								</Link>
							</Button>
						}
					/>
					<StackClusters services={services} className='mt-12' />
				</div>
			</Section>

			<ContactCTA socials={socials} email={email} />
		</SiteShell>
	)
}
