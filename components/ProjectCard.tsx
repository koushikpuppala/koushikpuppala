'use client'

import { ProjectsData, ProjectTagsData } from '@import/constant'
import Image from 'next/image'
import Link from 'next/link'
import { FaGithub, FaGlobe } from 'react-icons/fa6'
import { Tilt } from 'react-tilt'
import { MotionDiv } from '@import/components'
import classNames from 'classnames'
import { Fragment, useState } from 'react'
import { Listbox, Tab, Transition } from '@headlessui/react'
import { HiCheck, HiChevronUpDown } from 'react-icons/hi2'

const ProjectCardComponent = () => {
	const [selectedTag, setSelectedTag] = useState('All')

	return (
		<>
			<MotionDiv
				direction='right'
				delay={0.2}
				className='mx-auto mb-2 mt-4 max-w-3xl px-4 text-justify text-sm leading-6 text-secondary md:px-6 lg:mx-0 lg:px-6 lg:text-lg xl:max-w-5xl'>
				<div className='sm:hidden'>
					<label
						htmlFor='Tab'
						className='sr-only'>
						Tab
					</label>
					<Listbox
						value={selectedTag}
						onChange={setSelectedTag}>
						<div className='relative mt-1'>
							<Listbox.Button className='relative w-full cursor-default rounded-lg border-none bg-tertiary px-6 py-4 text-left capitalize text-white outline-none ring-1 ring-accent'>
								<span className='block truncate'>{selectedTag}</span>
								<span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
									<HiChevronUpDown
										className='h-5 w-5 text-gray-400'
										aria-hidden='true'
									/>
								</span>
							</Listbox.Button>
							<Transition
								as={Fragment}
								leave='transition ease-in duration-100'
								leaveFrom='opacity-100'
								leaveTo='opacity-0'>
								<Listbox.Options className='absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-lg bg-tertiary py-1 text-base ring-1 ring-accent'>
									{ProjectTagsData.map((tag, index) => (
										<Listbox.Option
											key={index}
											className={({ active }) =>
												classNames(
													{
														'text-accent': active,
														'text-white': !active,
													},
													'relative cursor-default select-none py-2 pl-10 pr-4',
												)
											}
											value={tag}>
											{({ selected }) => (
												<>
													<span
														className={classNames(
															{
																'font-medium': selected,
																'font-normal': !selected,
															},
															'block truncate',
														)}>
														{tag}
													</span>
													{selected ? (
														<span className='absolute inset-y-0 left-0 flex items-center pl-3 text-accent'>
															<HiCheck
																className='h-5 w-5'
																aria-hidden='true'
															/>
														</span>
													) : null}
												</>
											)}
										</Listbox.Option>
									))}
								</Listbox.Options>
							</Transition>
						</div>
					</Listbox>
				</div>
				<div className='hidden sm:block'>
					<Tab.Group
						defaultIndex={0}
						selectedIndex={ProjectTagsData.indexOf(selectedTag)}
						onChange={index => setSelectedTag(ProjectTagsData[index])}>
						<Tab.List className='flex w-full space-x-2 rounded-lg bg-tertiary/20'>
							{ProjectTagsData.map((tag, index) => (
								<Tab
									key={index}
									className={({ selected }) =>
										classNames(
											{
												'bg-tertiary text-white ring-1 ring-accent': selected,
												'text-secondary hover:bg-tertiary/40 hover:text-white': !selected,
											},
											'w-full rounded-lg px-4 py-2.5 text-sm font-medium leading-5 outline-none transition-colors duration-200 ease-in-out focus:outline-none',
										)
									}>
									{tag}
								</Tab>
							))}
						</Tab.List>
					</Tab.Group>
				</div>
			</MotionDiv>
			<div className='mt-6 flex flex-wrap justify-center gap-10 px-4 pb-40 lg:justify-normal lg:px-6 lg:pb-12'>
				{ProjectsData.filter(
					project =>
						// selectedTag === 'All' ? true : project.tags.map(tag => tag.name).includes(selectedTag),
						selectedTag === project.tag || selectedTag === 'All',
				).map(({ title, subtitle, description, tags, image, source_code_link, website }, index) => (
					<Tilt
						key={index}
						options={{
							max: 45,
							scale: 1,
							speed: 450,
						}}>
						<MotionDiv
							direction='right'
							delay={index * 0.2}
							className='shadow-card w-full rounded-2xl bg-green-pink-gradient p-px'>
							<div className='w-full rounded-2xl bg-tertiary p-5 sm:w-80'>
								<div className='relative h-44 w-full'>
									<Image
										src={image}
										alt='project_image'
										className='h-full w-full rounded-2xl object-cover'
									/>

									<div className='card-img_hover absolute inset-0 m-3 flex justify-end gap-1'>
										{source_code_link && (
											<Link
												href={`https://koushikpuppala.com/github/${source_code_link}`}
												target='_blank'
												className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black-gradient'>
												<span className='sr-only'>Source Code</span>
												<FaGithub size={16} />
											</Link>
										)}
										{website && (
											<Link
												href={website}
												target='_blank'
												className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black-gradient'>
												<span className='sr-only'>Website</span>
												<FaGlobe size={16} />
											</Link>
										)}
									</div>
								</div>

								<div className='mt-5'>
									<h3 className='line-clamp-1 text-2xl font-bold text-white'>{title}</h3>
									<p className='mt-2 line-clamp-1 text-sm text-secondary'>{subtitle}</p>
									<p className='mt-2 line-clamp-3 text-sm text-secondary'>
										{description
											.map(content => {
												return content
											})
											.join(' ')}
									</p>
								</div>

								<div className='mt-4 flex flex-wrap gap-2'>
									{tags.map(tag => (
										<p
											key={`${title}-${tag.name}`}
											className={classNames(tag.color, 'text-sm capitalize')}>
											#{tag.name}
										</p>
									))}
								</div>
							</div>
						</MotionDiv>
					</Tilt>
				))}
			</div>
		</>
	)
}

export default ProjectCardComponent
