import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProjectDocuments } from '@import/sanity'
import { Motion, ProjectCard } from '@import/components'

export const metadata: Metadata = {
	title: 'Projects',
	openGraph: { title: 'Projects' },
	twitter: { title: 'Projects' },
}

const ProjectsPage = async () => {
	const data = await getProjectDocuments()

	if (data.length === 0) return notFound()

	return (
		<div className='bg-primary/50 h-full'>
			<div className='h-full w-full overflow-y-auto'>
				<div className='container mx-auto h-full items-center py-6 text-left md:py-12 lg:py-24'>
					<Motion.div direction='right' delay={0.1} className='md:px-6'>
						<p className='text-secondary text-xs tracking-wider uppercase lg:text-base'>My work</p>
						<h2 className='text-3xl font-black text-white lg:text-5xl'>Projects</h2>
					</Motion.div>

					<Motion.p
						direction='right'
						delay={0.2}
						className='text-secondary mx-auto mt-4 mb-2 max-w-3xl text-justify text-sm leading-6 md:px-6 lg:mx-0 lg:text-lg xl:max-w-5xl'>
						Following projects showcases my skills and experience through real-world examples of my
						work. Each project is briefly described with links to code repositories and live demos
						in it. It reflects my ability to solve complex problems, work with different
						technologies, and manage projects effectively.
					</Motion.p>

					<ProjectCard data={data} />
				</div>
			</div>
		</div>
	)
}

export default ProjectsPage
