import type { NextPage } from 'next'

const Resume: NextPage = () => {
	return (
		<iframe
			style={{
				border: 'none',
				width: '100%',
				height: '100%',
				minHeight: '100vh',
			}}
			src='/Koushikpuppala Resume.pdf'></iframe>
	)
}

export default Resume
