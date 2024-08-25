import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getResumeDocument, urlForFile } from '@import/sanity'

export const metadata: Metadata = {
	title: 'Resume',
	openGraph: { title: 'Resume' },
	twitter: { title: 'Resume' },
}

const ResumePage = async () => {
	const resume = await getResumeDocument()

	if (!resume) return notFound()

	return (
		<iframe
			className='h-screen w-full rounded-2xl'
			src={urlForFile(resume)}
			loading='eager'
			title='Koushikpuppala Resume'
		/>
	)
}

export default ResumePage
