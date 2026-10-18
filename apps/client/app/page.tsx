import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'components/icons'
import { SiteShell } from 'components/site-shell'
import { Section, SectionHeader } from 'components/primitives/layout'
import { Reveal } from 'components/primitives/motion'
import { Hero } from 'components/home/hero'
import { SectionRail } from 'components/portfolio/section-rail'
import { FeaturedProjectRow, SupportingProjects } from 'components/portfolio/work-showcase'
import { ExperienceTimeline } from 'components/portfolio/experience-timeline'
import { StackClusters } from 'components/portfolio/stack-clusters'
import {
	AboutBlock,
	ContactCTA,
	EducationBlock,
	LeadershipStrip,
	TechTicker,
} from 'components/home/home-sections'
import { Button } from 'ui/button'
import { getHomeData } from 'lib/home-data'
import { getAboutData } from 'lib/about-data'
import { getExperienceData } from 'lib/experience-data'
import { getProjectsData } from 'lib/projects-data'
import { getEducationData } from 'lib/education-data'
import { getServicesData } from 'lib/skills-data'
import { getSocialsData } from 'lib/social-data'
import { resolveMetadataByPath } from 'lib/metadata-data'
import { emailAddress } from 'lib/email'

export const generateMetadata = async (): Promise<Metadata> => {
	'use cache'
	return resolveMetadataByPath('/')
}

const sections = [
	{ id: 'work', label: 'Work' },
	{ id: 'stack', label: 'Stack' },
	{ id: 'experience', label: 'Experience' },
	{ id: 'education', label: 'Education' },
	{ id: 'about', label: 'About' },
	{ id: 'contact', label: 'Contact' },
]

const HomePage = async () => {
	const [home, about, experience, projects, education, services, socials] = await Promise.all([
		getHomeData(),
		getAboutData(),
		getExperienceData(),
		getProjectsData(),
		getEducationData(),
		getServicesData(),
		getSocialsData(),
	])

	const featured = projects.filter(project => project.featured)
	const supporting = projects.filter(project => !project.featured)
	const current = experience.find(item => item.isCurrent || !item.endDate) ?? experience[0]
	const email = emailAddress(socials)

	return (
		<SiteShell socials={socials}>
			<SectionRail sections={sections} />

			<Hero home={home} socials={socials} current={current} location={about.location} />

			<TechTicker services={services} />

			<Section id='work' labelledBy='work-title'>
				<div className='container-page'>
					<SectionHeader
						index='01'
						eyebrow='Selected work'
						titleId='work-title'
						title={
							<>
								Products and platforms
								<br className='hidden sm:block' /> I&apos;ve built
							</>
						}
						description='Payments infrastructure, travel integrations and long-running personal projects — the systems behind the interfaces.'
						action={
							<Button asChild variant='outline' className='group'>
								<Link href='/projects'>
									All projects <ArrowRight className='arrow-slide size-4' />
								</Link>
							</Button>
						}
					/>

					<div className='mt-16 space-y-20 lg:mt-20 lg:space-y-28'>
						{featured.map((project, i) => (
							<FeaturedProjectRow
								key={project.id}
								project={project}
								index={i}
								flip={i % 2 === 1}
								eager={i === 0}
							/>
						))}
					</div>

					{supporting.length ? (
						<div className='mt-20 lg:mt-28'>
							<Reveal className='flex items-center gap-4'>
								<span className='text-eyebrow whitespace-nowrap'>Also built</span>
								<span className='bg-border h-px flex-1' />
							</Reveal>
							<SupportingProjects
								projects={supporting}
								startIndex={featured.length + 1}
								className='border-border mt-6 border-t'
							/>
						</div>
					) : null}
				</div>
			</Section>

			<Section id='stack' labelledBy='stack-title' className='border-border bg-surface/30 border-t'>
				<div className='container-page'>
					<SectionHeader
						index='02'
						eyebrow='Engineering stack'
						titleId='stack-title'
						title='What I build with'
						description='The tools I reach for across the rendering layer, the API layer and everything holding them together.'
						action={
							<Button asChild variant='ghost' className='group'>
								<Link href='/services'>
									Skills in detail <ArrowRight className='arrow-slide size-4' />
								</Link>
							</Button>
						}
					/>
					<StackClusters services={services} className='mt-12 lg:mt-16' />
				</div>
			</Section>

			<Section id='experience' labelledBy='experience-title' className='border-border border-t'>
				<div
					className='pointer-events-none absolute top-0 -left-40 size-136 rounded-full opacity-40 blur-3xl'
					style={{ background: 'var(--glow-cool)' }}
					aria-hidden
				/>
				<div className='container-page relative'>
					<SectionHeader
						index='03'
						eyebrow='Experience'
						titleId='experience-title'
						title="Where I've shipped"
						description='Three years across product engineering, infrastructure and university platforms.'
						action={
							<Button asChild variant='ghost' className='group'>
								<Link href='/experience'>
									Full history <ArrowRight className='arrow-slide size-4' />
								</Link>
							</Button>
						}
					/>
					<div className='mt-12 lg:mt-16'>
						<ExperienceTimeline items={experience.slice(0, 3)} />
					</div>
				</div>
			</Section>

			<Section id='education' labelledBy='education-title' className='border-border border-t'>
				<div className='container-page'>
					<SectionHeader
						index='04'
						eyebrow='Education & leadership'
						titleId='education-title'
						title='Foundations'
						size='md'
						action={
							<Button asChild variant='ghost' className='group'>
								<Link href='/education'>
									Education page <ArrowRight className='arrow-slide size-4' />
								</Link>
							</Button>
						}
					/>
					<EducationBlock items={education} className='mt-12' />
					<div className='mt-10'>
						<LeadershipStrip experience={experience} />
					</div>
				</div>
			</Section>

			<Section id='about' labelledBy='about-title' className='border-border bg-surface/30 border-t'>
				<div className='container-page'>
					<SectionHeader
						index='05'
						eyebrow='About'
						titleId='about-title'
						title={about.title}
						size='md'
					/>
					<AboutBlock
						about={about}
						current={current}
						education={education[0]}
						className='mt-12 lg:mt-16'
					/>
				</div>
			</Section>

			<section id='contact' aria-labelledby='contact-title'>
				<ContactCTA socials={socials} email={email} />
			</section>
		</SiteShell>
	)
}

export default HomePage
