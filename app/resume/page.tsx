import { ABOUT_DOCUMENT, sanityQuery, urlForFile } from '@import/sanity'
import { AboutSchemaProps } from '@import/types'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Resume',
	openGraph: { title: 'Resume' },
	twitter: { title: 'Resume' },
	alternates: { canonical: 'https://koushikpuppala.com/resume' },
}

const ResumePage = async () => {
	const data: AboutSchemaProps | null = await sanityQuery(ABOUT_DOCUMENT)

	if (!data) return notFound()

	return (
		<iframe
			className='h-screen w-full rounded-2xl'
			src={urlForFile(data.resume)}
			loading='eager'
			title='Koushikpuppala Resume'
		/>
	)
}

export default ResumePage
