'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FaGithub, FaGlobe } from 'react-icons/fa6'
import { CardBody, CardContainer, CardItem, DialogComponent, MotionDiv } from '@import/components'
import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import {
	Listbox,
	ListboxButton,
	ListboxOption,
	ListboxOptions,
	Tab,
	TabGroup,
	TabList,
	Transition,
} from '@headlessui/react'
import { HiCheck, HiChevronUpDown } from 'react-icons/hi2'
import { ProjectSchemaProps } from '@import/types'
import { urlForImage } from '@import/sanity'

const ProjectCardComponent = ({ data }: { data: ProjectSchemaProps[] }) => {
	const tagsSet = new Set(data.map(project => project.tag))
	const tags = ['All', ...Array.from(tagsSet)]
	const [tag, setTag] = useState('All')
	const [random, setRandom] = useState(Math.random() * 1000)
	const [projects, setProjects] = useState(data)
	const [project, setProject] = useState<ProjectSchemaProps>()
	const [open, setOpen] = useState(false)

	const cancelButtonRef = useRef(null)

	const handleClick = (index: number) => {
		setOpen(true)
		setProject(projects[index])
	}

	useEffect(() => {
		tag !== 'All' && setProjects(data.filter(project => project.tag === tag))

		setRandom(Math.random() * 1000)

		return () => {
			setOpen(false)
			setProjects(data)
		}
	}, [tag, data])

	return (
		<>
			<MotionDiv
				direction='right'
				delay={0.2}
				className='mx-auto mb-2 mt-4 max-w-3xl px-4 text-justify text-sm leading-6 text-secondary md:px-6 lg:mx-0 lg:px-6 lg:text-lg xl:max-w-5xl'>
				<div className='md:hidden'>
					<label htmlFor='Tab' className='sr-only'>
						Tab
					</label>
					<Listbox value={tag} onChange={setTag}>
						<ListboxButton
							className={classNames(
								'relative block w-full rounded-lg bg-white/5 py-1.5 pl-3 pr-8 text-left text-sm/6 text-white',
								'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
							)}>
							{tag}
							<HiChevronUpDown
								className='group pointer-events-none absolute right-2.5 top-2.5 size-4 fill-white/60'
								aria-hidden='true'
							/>
						</ListboxButton>
						<Transition leave='transition ease-in duration-100' leaveFrom='opacity-100' leaveTo='opacity-0'>
							<ListboxOptions
								anchor='bottom'
								className='mt-2 w-[var(--button-width)] rounded-xl border border-white/5 bg-black/10 p-1 backdrop-blur [--anchor-gap:var(--spacing-1)] focus:outline-none'>
								{tags.map(person => (
									<ListboxOption
										key={person}
										value={person}
										className='group flex cursor-default select-none items-center gap-2 rounded-lg px-3 py-1.5 data-[focus]:bg-white/10'>
										<HiCheck className='invisible size-4 fill-white group-data-[selected]:visible' />
										<div className='text-sm/6 text-white'>{person}</div>
									</ListboxOption>
								))}
							</ListboxOptions>
						</Transition>
					</Listbox>
				</div>
				<div className='hidden md:block'>
					<TabGroup
						defaultIndex={0}
						selectedIndex={tags.indexOf(tag)}
						onChange={index => setTag(tags[index])}>
						<TabList className='flex gap-4'>
							{tags.map(name => (
								<Tab
									key={name}
									className='w-full rounded-lg px-3 py-1 text-sm/6 font-medium leading-5 text-secondary outline-none transition-all duration-200 ease-in-out focus:outline-none data-[hover]:bg-white/5 data-[selected]:bg-white/10 data-[selected]:data-[hover]:bg-white/10 data-[selected]:text-white data-[selected]:ring-1 data-[selected]:ring-zinc-500'>
									{name}
								</Tab>
							))}
						</TabList>
					</TabGroup>
				</div>
			</MotionDiv>
			<div className='mt-6 flex flex-wrap justify-center gap-10 px-4 pb-40 lg:justify-normal lg:px-6 lg:pb-12'>
				{projects.map(({ title, subtitle, descriptions, tags, image, github, website }, index) => (
					<MotionDiv direction='right' delay={index * 0.2} key={random + index}>
						<CardContainer key={index} className='w-full rounded-2xl bg-green-pink-gradient p-px shadow-xl'>
							<CardBody
								className='group/card w-full cursor-pointer rounded-2xl bg-quaternary p-5 sm:w-80'
								onClick={() => handleClick(index)}>
								<CardItem translateZ={125} className='relative h-44 w-full'>
									<Image
										src={urlForImage(image[0])}
										alt={title}
										priority={true}
										width={1920}
										height={1080}
										className='w-full rounded-2xl object-cover group-hover/card:border group-hover/card:border-accent/5'
									/>

									<div className='absolute inset-0 m-3 flex justify-end gap-1'>
										{github && (
											<span className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black-gradient'>
												<span className='sr-only'>Source Code</span>
												<FaGithub size={16} />
											</span>
										)}
										{website && (
											<span className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black-gradient'>
												<span className='sr-only'>Website</span>
												<FaGlobe size={16} />
											</span>
										)}
									</div>
								</CardItem>

								<div className='mt-5'>
									<CardItem translateZ={100}>
										<h3 className='line-clamp-1 text-2xl font-bold text-white'>{title}</h3>
									</CardItem>
									<CardItem translateZ={85}>
										<p className='mt-2 line-clamp-1 text-sm text-secondary'>{subtitle}</p>
									</CardItem>
									<CardItem translateZ={75}>
										<p className='mt-2 line-clamp-3 text-sm text-secondary'>
											{descriptions.join(' ')}
										</p>
									</CardItem>
								</div>

								<CardItem translateZ={85} className='mt-4 flex flex-wrap gap-2'>
									{tags.map((tag, index) => (
										<p
											key={`${title}-${tag}`}
											className={classNames(
												{
													'blue-text-gradient': index === 0,
													'green-text-gradient hidden': index === 1,
													'pink-text-gradient hidden': index === 2,
												},
												'whitespace-nowrap text-sm capitalize',
											)}>
											#{tag}
										</p>
									))}
								</CardItem>
							</CardBody>
						</CardContainer>
					</MotionDiv>
				))}
			</div>
			{project && (
				<DialogComponent open={open} setOpen={setOpen} cancelButtonRef={cancelButtonRef}>
					<div className='flex w-full rounded-2xl bg-accent-gradient p-px'>
						<div className='w-full rounded-2xl bg-quaternary p-5 sm:w-[30rem]'>
							<div className='relative h-auto w-full'>
								<Image
									src={urlForImage(project.image[0])}
									alt={project.title}
									priority={true}
									width={1920}
									height={1080}
									className='h-full w-full rounded-2xl object-cover'
								/>

								<div className='absolute inset-0 m-3 flex justify-end gap-1'>
									{project.github && (
										<Link
											href={project.external ? project.github : `/github/${project.github}`}
											target='_blank'
											className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black-gradient outline-none'>
											<span className='sr-only'>Source Code</span>
											<FaGithub size={16} />
										</Link>
									)}
									{project.website && (
										<Link
											href={project.website}
											target='_blank'
											className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black-gradient outline-none'>
											<span className='sr-only'>Website</span>
											<FaGlobe size={16} />
										</Link>
									)}
								</div>
							</div>

							<div className='mt-5'>
								<h3 className='text-2xl font-bold text-white'>{project.title}</h3>
								<p className='mt-2 text-sm text-secondary'>{project.subtitle}</p>
								<p className='mt-2 text-sm text-secondary'>{project.descriptions.join(' ')}</p>
							</div>

							<div className='mt-4 flex flex-wrap gap-2'>
								{project.tags.map((tag, index) => (
									<p
										key={`${project.title}-${tag}`}
										className={classNames(
											{
												'blue-text-gradient': index === 0,
												'green-text-gradient': index === 1,
												'pink-text-gradient': index === 2,
											},
											'text-sm capitalize',
										)}>
										#{tag}
									</p>
								))}
							</div>
						</div>
					</div>
				</DialogComponent>
			)}
		</>
	)
}

export default ProjectCardComponent
