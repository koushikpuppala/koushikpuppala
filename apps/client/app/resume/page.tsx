import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { SignalArrow, PageEntrance } from 'ui/motion'
import { getPublishedResume, AUTHORITATIVE_RESUME } from '../../lib/resume-data'
import { PublicFooter } from '../../components/footer'

import { getPageMetadata } from '../../lib/metadata-data'

export const metadata: Metadata = getPageMetadata('resume')

async function AsyncResumeViewer() {
	const resume = await getPublishedResume()

	return (
		<>
			{/* Sub Navigation & Actions Bar */}
			<div className='w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 flex flex-wrap items-center justify-between gap-3'>
				<Link
					href='/'
					className='inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-signal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal rounded py-1'>
					<span aria-hidden='true'>←</span>
					<span>RETURN TO PORTFOLIO</span>
				</Link>

				<div className='flex items-center gap-3'>
					<span className='hidden sm:inline-block font-mono text-xs text-muted-foreground'>
						{resume.formatLabel} • {resume.fileSizeFormatted}
					</span>
					<a
						href={resume.downloadUrl}
						download='Koushik_Puppala_Resume.pdf'
						className='group inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-signal text-signal-foreground font-mono text-xs font-semibold uppercase tracking-wider hover:opacity-90 active:scale-[0.98] transition-all shadow-md shadow-signal/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal'>
						<span>DOWNLOAD PDF</span>
						<SignalArrow size={12} />
					</a>
				</div>
			</div>

			{/* PDF Viewer Frame with Mobile Helper */}
			<PageEntrance
				delay={0.05}
				className='flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 flex flex-col space-y-4'>
				{/* Mobile Download Helper Banner */}
				<div className='block sm:hidden p-3.5 rounded-xl border border-border/80 bg-surface/60 text-xs font-mono text-muted-foreground space-y-2'>
					<div className='flex items-center justify-between'>
						<span className='text-signal font-semibold uppercase tracking-wider'>
							MOBILE PDF PREVIEW
						</span>
						<span>{resume.fileSizeFormatted}</span>
					</div>
					<p className='text-[11px] leading-relaxed'>
						For optimal formatting on mobile devices, you can download the authentic PDF directly to
						your device storage.
					</p>
				</div>

				<div className='w-full flex-1 min-h-[65vh] sm:min-h-[80vh] rounded-xl border border-border/80 bg-surface/40 overflow-hidden shadow-2xl relative'>
					<iframe
						src={`${resume.previewUrl}#toolbar=0`}
						title='Koushik Puppala Authoritative Resume'
						className='w-full h-full min-h-[65vh] sm:min-h-[80vh] rounded-xl border-0'
						loading='eager'
					/>
				</div>
			</PageEntrance>
		</>
	)
}

function StaticResumeViewerFallback() {
	const resume = AUTHORITATIVE_RESUME
	return (
		<>
			<div className='w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 flex flex-wrap items-center justify-between gap-3'>
				<Link
					href='/'
					className='inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-signal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal rounded py-1'>
					<span aria-hidden='true'>←</span>
					<span>RETURN TO PORTFOLIO</span>
				</Link>

				<div className='flex items-center gap-3'>
					<span className='hidden sm:inline-block font-mono text-xs text-muted-foreground'>
						{resume.formatLabel} • {resume.fileSizeFormatted}
					</span>
					<a
						href={resume.downloadUrl}
						download='Koushik_Puppala_Resume.pdf'
						className='group inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-signal text-signal-foreground font-mono text-xs font-semibold uppercase tracking-wider hover:opacity-90 active:scale-[0.98] transition-all shadow-md shadow-signal/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal'>
						<span>DOWNLOAD PDF</span>
						<SignalArrow size={12} />
					</a>
				</div>
			</div>

			<PageEntrance
				delay={0.05}
				className='flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 flex flex-col space-y-4'>
				<div className='block sm:hidden p-3.5 rounded-xl border border-border/80 bg-surface/60 text-xs font-mono text-muted-foreground space-y-2'>
					<div className='flex items-center justify-between'>
						<span className='text-signal font-semibold uppercase tracking-wider'>
							MOBILE PDF PREVIEW
						</span>
						<span>{resume.fileSizeFormatted}</span>
					</div>
					<p className='text-[11px] leading-relaxed'>
						For optimal formatting on mobile devices, you can download the authentic PDF directly to
						your device storage.
					</p>
				</div>

				<div className='w-full flex-1 min-h-[65vh] sm:min-h-[80vh] rounded-xl border border-border/80 bg-surface/40 overflow-hidden shadow-2xl relative'>
					<iframe
						src={`${resume.previewUrl}#toolbar=0`}
						title='Koushik Puppala Authoritative Resume'
						className='w-full h-full min-h-[65vh] sm:min-h-[80vh] rounded-xl border-0'
						loading='eager'
					/>
				</div>
			</PageEntrance>
		</>
	)
}

export default function ResumePage() {
	return (
		<main className='min-h-screen bg-background text-foreground flex flex-col pt-24 sm:pt-28'>
			<Suspense fallback={<StaticResumeViewerFallback />}>
				<AsyncResumeViewer />
			</Suspense>

			{/* Site Footer */}
			<PublicFooter />
		</main>
	)
}
