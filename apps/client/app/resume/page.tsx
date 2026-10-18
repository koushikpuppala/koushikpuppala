import type { RecordRowProps } from 'types/components/client'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Download } from 'components/icons'
import { SiteShell } from 'components/site-shell'
import { Chip, Section, SectionHeader } from 'components/primitives/layout'
import { Reveal } from 'components/primitives/motion'
import { PageHero } from 'components/home/page-hero'
import { ContactCTA } from 'components/home/home-sections'
import { Button } from 'ui/button'
import { formatRange } from 'lib/format'
import { getResumeData } from 'lib/resume-data'
import { getExperienceData } from 'lib/experience-data'
import { getEducationData } from 'lib/education-data'
import { getServicesData } from 'lib/skills-data'
import { getSocialsData } from 'lib/social-data'
import { resolveMetadataByPath } from 'lib/metadata-data'
import { emailAddress } from 'lib/email'

export const generateMetadata = async (): Promise<Metadata> => {
	'use cache'
	return resolveMetadataByPath('/resume')
}

const RecordRow = ({ period, title, meta, detail }: RecordRowProps) => {
	return (
		<div className='border-border grid gap-1.5 border-t py-6 last:border-b sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] sm:gap-10'>
			<p className='numeric text-muted-foreground font-mono text-[0.75rem]'>{period}</p>
			<div className='min-w-0'>
				<h3 className='font-display text-lg font-medium tracking-tight'>{title}</h3>
				<p className='text-foreground/85 mt-1 text-sm'>{meta}</p>
				{detail ? <p className='text-muted-foreground mt-1 text-sm'>{detail}</p> : null}
			</div>
		</div>
	)
}

const ResumePage = async () => {
	const [resume, experiences, education, services, socials] = await Promise.all([
		getResumeData(),
		getExperienceData(),
		getEducationData(),
		getServicesData(),
		getSocialsData(),
	])

	const email = emailAddress(socials)
	const fileUrl = resume.downloadUrl && resume.downloadUrl !== '#' ? resume.downloadUrl : null
	const updated = resume.updatedAt
		? new Date(resume.updatedAt).toLocaleDateString('en-US', { dateStyle: 'medium' })
		: null
	const title = resume.title || 'Resume'
	const summary = resume.summary || ''
	const version = resume.versionName || ''

	return (
		<SiteShell socials={socials}>
			<PageHero
				eyebrow='Resume'
				title={title}
				lead={summary}
				meta={[version, updated ? `Updated ${updated}` : ''].filter(Boolean)}
				actions={
					fileUrl ? (
						<>
							<Button asChild size='lg' variant='signal'>
								{/* No prefetch: prefetching this route would call it and count a download. */}
								<Link href='/resume/download' prefetch={false} rel='nofollow'>
									<Download className='size-4' /> Download PDF
								</Link>
							</Button>
							<Button asChild size='lg' variant='outline' className='group'>
								<Link href='/contact'>
									Contact me <ArrowRight className='arrow-slide size-4' />
								</Link>
							</Button>
						</>
					) : (
						<>
							<Button asChild size='lg' variant='signal' className='group'>
								<Link href='/contact'>
									Request a copy <ArrowRight className='arrow-slide size-4' />
								</Link>
							</Button>
							<Button asChild size='lg' variant='outline' className='group'>
								<Link href='/experience'>
									See the timeline <ArrowRight className='arrow-slide size-4' />
								</Link>
							</Button>
						</>
					)
				}
			/>

			{!fileUrl ? (
				<div className='border-border bg-surface/50 border-b'>
					<p className='container-page text-muted-foreground py-4 font-mono text-[0.75rem]'>
						The resume file hasn&apos;t been published yet — the record below stays current.
					</p>
				</div>
			) : null}

			<Section className='pt-16 lg:pt-20'>
				<div className='container-page'>
					<SectionHeader index='01' eyebrow='Experience' title='Professional record' size='md' />
					<div className='mt-12'>
						{experiences.map(item => (
							<Reveal key={item.id}>
								<RecordRow
									period={formatRange(item.startDate, item.endDate)}
									title={item.title}
									meta={item.organization}
									detail={item.location}
								/>
							</Reveal>
						))}
					</div>
				</div>
			</Section>

			<Section className='border-border border-t pt-16 lg:pt-20'>
				<div className='container-page'>
					<SectionHeader index='02' eyebrow='Education' title='Academic record' size='md' />
					<div className='mt-12'>
						{education.map(item => (
							<Reveal key={item.id}>
								<RecordRow
									period={formatRange(item.startDate, item.endDate)}
									title={[item.degree, item.fieldOfStudy].filter(Boolean).join(' · ')}
									meta={item.university}
									detail={item.description.join(' ')}
								/>
							</Reveal>
						))}
					</div>
				</div>
			</Section>

			<Section className='border-border border-t pt-16 lg:pt-20'>
				<div className='container-page'>
					<SectionHeader index='03' eyebrow='Skills' title='Technologies' size='md' />
					<div className='mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
						{services.map((service, i) => (
							<Reveal key={service.id} delay={i * 50}>
								<div>
									<p className='text-eyebrow'>{service.title}</p>
									<div className='mt-3 flex flex-wrap gap-1.5'>
										{service.features.map(item => (
											<Chip key={item} tone='outline'>
												{item}
											</Chip>
										))}
									</div>
								</div>
							</Reveal>
						))}
					</div>
				</div>
			</Section>

			<ContactCTA socials={socials} email={email} />
		</SiteShell>
	)
}

export default ResumePage
