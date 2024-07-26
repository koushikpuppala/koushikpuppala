import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Resume',
	openGraph: { title: 'Resume' },
	twitter: { title: 'Resume' },
	alternates: { canonical: 'https://koushikpuppala.com/resume' },
}

const ResumePage = () => {
	return (
		<iframe
			className='h-screen w-full rounded-2xl'
			src='/koushikpuppala_resume.pdf'
			loading='eager'
			title='Koushikpuppala Resume'
		/>
		// <span className='sr-only'>Koushikpuppala Resume</span>
	)
}

export default ResumePage
