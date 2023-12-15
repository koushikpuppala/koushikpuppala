import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Resume',
	openGraph: {
		title: 'Resume',
	},
	twitter: {
		title: 'Resume',
	},
}

const ResumePage = () => {
	return (
		<>
			<span className='sr-only'>My Resume</span>
			<iframe
				className='h-full w-full'
				src='/resume.pdf'
				title='Resume'
				allowTransparency={true}
			/>
		</>
	)
}

export default ResumePage
