import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, GraduationCap } from '@/components/icons'
import { SiteShell } from '@/components/site-shell'
import { EmptyState, Section, SectionHeader } from '@/components/primitives'
import { PageHero } from '@/components/portfolio/page-hero'
import { ContactCTA, EducationBlock, LeadershipStrip } from '@/components/portfolio/home-sections'
import { Button } from '@/components/ui/button'
import { getEducation, getExperience, getSocials } from '@/lib/portfolio-data'

export const metadata: Metadata = {
	title: 'Education',
	description:
		'B.Tech in Computer Science and Engineering at IIIT Raichur, intermediate studies, and student community leadership.',
	openGraph: {
		title: 'Education — Koushik Puppala',
		description: 'Academic background and student community leadership.',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
	},
}

export default async function EducationPage() {
	const [education, experience, socials] = await Promise.all([
		getEducation(),
		getExperience(),
		getSocials(),
	])

	const email = socials.find(social => social.platform === 'mail')?.handle ?? null
	const primary = education[0]

	return (
		<SiteShell socials={socials}>
			<PageHero
				eyebrow='Education'
				title='Foundations and the teams behind them'
				lines={['Foundations and', 'the teams behind them']}
				lead={
					primary
						? `${primary.degree}${primary.field ? ` in ${primary.field}` : ''} at ${primary.institution}, alongside the student communities and university platforms I helped build.`
						: null
				}
				meta={['India']}
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
							<EducationBlock items={education} detailed className='mt-12' />
						</>
					)}
				</div>
			</Section>

			<Section className='border-t border-border pt-16 lg:pt-20'>
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
