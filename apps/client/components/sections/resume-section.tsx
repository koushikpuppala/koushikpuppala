import { Suspense } from 'react'
import { SignalArrow } from 'ui/motion'
import { SectionFrame } from './section-frame'
import { SectionHeader } from './section-header'
import { SectionPlaceholder } from './section-placeholder'
import { ResumeCard } from './resume-card'
import { getPublishedResume, type PortfolioResume } from '../../lib/resume-data'

export interface ResumeSectionProps {
	resume?: PortfolioResume
	className?: string
}

async function ResumeContent({ resume }: { resume?: PortfolioResume }) {
	const data = resume || (await getPublishedResume())

	return <ResumeCard resume={data} />
}

/**
 * ResumeSection
 * Recreates the Lovable Resume Section:
 * - Editorial SectionHeader with technical index "06 // RESUME"
 * - Credentials Console and Authoritative Dossier presentation
 * - Verified employment, institutional leadership, and distributed systems pillars
 * - Direct download of the authentic Koushik Puppala resume PDF
 * - Streaming Suspense boundary with structural SectionPlaceholder fallback
 * - Fully responsive across desktop, tablet, and mobile
 */
export const ResumeSection = ({ resume, className }: ResumeSectionProps) => {
	return (
		<SectionFrame id='resume' background='dotgrid' className={className}>
			<SectionHeader
				index='06'
				tag='RESUME'
				title='Authoritative Resume & Professional Summary'
				description='Comprehensive technical credentials, impact summaries, production system benchmarks, and verified employment history available for immediate review and download.'
				action={
					<a
						href='/resume/koushikpuppala_resume.pdf'
						download='Koushik_Puppala_Resume.pdf'
						className='group inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-signal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal rounded'>
						<span>DOWNLOAD PDF</span>
						<SignalArrow
							size={12}
							className='transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5'
						/>
					</a>
				}
			/>

			{/* Streaming Suspense boundary for Resume Console */}
			<Suspense fallback={<SectionPlaceholder variant='resume' />}>
				<ResumeContent resume={resume} />
			</Suspense>
		</SectionFrame>
	)
}
