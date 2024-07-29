import Image from 'next/image'
import Link from 'next/link'
import { FaGithub, FaGlobe } from 'react-icons/fa6'
import { CardBody, CardContainer, CardItem, DialogComponent, MotionDiv } from '@import/components'
import classNames from 'classnames'
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
import { ProjectCardComponentProps } from '@import/types'
import { urlForImage } from '@import/sanity'

const ProjectCardComponent = ({ data, searchParams }: ProjectCardComponentProps) => {
	const id = searchParams?.id ?? undefined
	const tag = searchParams?.tag?.toLocaleLowerCase() ?? 'all'
	const tags = ['all', ...Array.from(new Set(data.map(project => project.tag.toLocaleLowerCase())))]
	const projects = data.filter(project => project.tag.toLocaleLowerCase() === tag || tag === 'all')
	const project = id ? projects.find(project => project._rev === id) : undefined

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
					<Listbox value={tag}>
						<ListboxButton
							className={classNames(
								'relative block w-full rounded-lg bg-white/5 py-1.5 pl-3 pr-8 text-left text-sm/6 capitalize text-white',
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
								{tags.map(tag => (
									<Link
										href={`?${new URLSearchParams(tag !== 'all' ? { tag: tag } : {}).toString()}`}
										key={tag}
										className='flex w-full'>
										<ListboxOption
											value={tag}
											className='group flex w-full cursor-default select-none items-center gap-2 rounded-lg px-3 py-1.5 capitalize data-[focus]:bg-white/10'>
											<HiCheck className='invisible size-4 fill-white group-data-[selected]:visible' />
											<div className='text-sm/6 text-white'>{tag}</div>
										</ListboxOption>
									</Link>
								))}
							</ListboxOptions>
						</Transition>
					</Listbox>
				</div>
				<div className='hidden md:block'>
					<TabGroup defaultIndex={0} selectedIndex={tags.indexOf(tag)}>
						<TabList className='flex gap-4'>
							{tags.map(tag => (
								<Tab
									key={tag}
									className='flex w-full rounded-lg text-sm/6 font-medium leading-5 text-secondary outline-none transition-all duration-200 ease-in-out focus:outline-none data-[hover]:bg-white/5 data-[selected]:bg-white/10 data-[selected]:data-[hover]:bg-white/10 data-[selected]:text-white data-[selected]:ring-1 data-[selected]:ring-zinc-500'>
									<Link
										href={`?${new URLSearchParams(tag !== 'all' ? { tag: tag } : {}).toString()}`}
										className='flex h-full w-full items-center justify-center px-3 py-1 capitalize focus:outline-none'>
										{tag}
									</Link>
								</Tab>
							))}
						</TabList>
					</TabGroup>
				</div>
			</MotionDiv>
			<div className='mt-6 flex flex-wrap justify-center gap-10 px-4 pb-40 lg:justify-normal lg:px-6 lg:pb-12'>
				{projects.map(({ title, subtitle, descriptions, tags, image, github, website, _rev }, index) => (
					<MotionDiv direction='right' delay={index * 0.15} key={tag + index}>
						<CardContainer
							key={index}
							className='w-full rounded-2xl bg-green-pink-gradient p-px shadow-xl'
							options={{ scale: 1 }}>
							<CardBody className='group/card w-full cursor-pointer rounded-2xl bg-quaternary p-5 sm:w-80'>
								<Link
									href={`?${new URLSearchParams(
										tag === 'all' ? { id: _rev } : { tag: tag, id: _rev },
									).toString()}`}>
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
								</Link>
							</CardBody>
						</CardContainer>
					</MotionDiv>
				))}
			</div>
			{project && (
				<DialogComponent tag={tag}>
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
											href={project.github}
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
