import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, GraduationCap } from 'components/icons'
import { SiteShell } from 'components/site-shell'
import { EmptyState } from 'components/primitives/feedback'
import { Section, SectionHeader } from 'components/primitives/layout'
import { PageHero } from 'components/home/page-hero'
import { ContactCTA, EducationBlock, LeadershipStrip } from 'components/home/home-sections'
import { Button } from 'ui/button'
import { getEducationData } from 'lib/education-data'
import { getExperienceData } from 'lib/experience-data'
import { getSocialsData } from 'lib/social-data'
import { resolveMetadataByPath } from 'lib/metadata-data'
import { JsonLd } from 'components/json-ld'
import { buildPageGraph, buildPerson } from 'lib/structured-data'
import { emailAddress } from 'lib/email'

export const generateMetadata = async (): Promise<Metadata> => {
	'use cache'
	return resolveMetadataByPath('/education')
}

const EducationPage = async () => {
	const [education, experience, socials] = await Promise.all([
		getEducationData(),
		getExperienceData(),
		getSocialsData(),
	])

	const email = emailAddress(socials)
	const primary = education[0]

	return (
		<SiteShell socials={socials}>
			<JsonLd
				data={buildPageGraph({
					path: '/education',
					type: 'ProfilePage',
					name: 'Education',
					person: buildPerson({ education, experience, socials }),
				})}
			/>

			<PageHero
				eyebrow='Education'
				title='Foundations and the teams behind them'
				lines={['Foundations and', 'the teams behind them']}
				lead={
					primary
						? `${primary.degree}${primary.fieldOfStudy ? ` in ${primary.fieldOfStudy}` : ''} at ${primary.university}, alongside the student communities and university platforms I helped build.`
						: null
				}
				meta={primary?.location ? [primary.location] : []}
				actions={
					<Button asChild size='lg' variant='outline' className='group'>
						<Link href='/experience'>
							Professional timeline <ArrowRight className='arrow-slide size-4' />
						</Link>
					</Button>
				}
			/>

			<Section className='pt-16 lg:pt-20'>
				<div className='container-page'>
					{education.length === 0 ? (
						<EmptyState
							title='No education entries yet'
							icon={<GraduationCap className='size-5' />}
						/>
					) : (
						<>
							<SectionHeader index='01' eyebrow='Academic' title='Degrees' size='md' />
							<EducationBlock items={education} className='mt-12' />
						</>
					)}
				</div>
			</Section>

			<Section className='border-border border-t pt-16 lg:pt-20'>
				<div className='container-page'>
					<SectionHeader index='02' eyebrow='Leadership' title='Beyond coursework' size='md' />
					<div className='mt-12'>
						<LeadershipStrip experience={experience} />
					</div>
				</div>
			</Section>

			<ContactCTA socials={socials} email={email} />
		</SiteShell>
	)
}

export default EducationPage
