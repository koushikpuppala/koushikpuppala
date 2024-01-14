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
			className='h-screen w-full rounded-2xl'
			src='/resume.pdf'
			allowTransparency={true}
			loading='lazy'
			title='Resume'>
			Loading…
		</iframe>
	)
}

export default ResumePage
