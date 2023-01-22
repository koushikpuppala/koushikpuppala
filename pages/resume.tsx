import { Header } from '@import/components'
import type { NextPage } from 'next'

const Resume: NextPage = () => {
	return (
		<>
			<Header title='Koushik Puppala | Resume' />
			<h1
				style={{
					display: 'none',
				}}>
				Resume
			</h1>
			<iframe
				style={{
					border: 'none',
					width: '100%',
					height: '100%',
					minHeight: '100vh',
				}}
				src='/Koushikpuppala Resume.pdf'></iframe>
		</>
	)
}

export default Resume
