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
		<iframe
			className='h-full w-full'
			src='/resume.pdf'
			title='Resume'
			allowTransparency={true}>
			<span className='sr-only'>My Resume</span>
		</iframe>
	)
}

export default ResumePage
