'use client'

import type { CreateHomeForm, FormError } from 'types/components'

import { useFormReducer } from 'reducers/form'
import { useEffect, useState, useTransition } from 'react'
import { classNames } from 'utils/classNames'
import { HomeFormValidation } from 'validation/home'
import { createHome } from 'actions/server'

export const AdminHomeCreateComponent = () => {
	const [isSubmitting, startSubmittingTransition] = useTransition()

	const { form, error, setField, resetForm, setError, setErrors, resetError } =
		useFormReducer<CreateHomeForm>({
			title: '',
			separator: '',
			subtitles: [],
			content: '',
		})

	const [isDisabled, setIsDisabled] = useState<boolean>(true)

	useEffect(() => {
		const { success } = HomeFormValidation.safeParse(form)

		setIsDisabled(!success)
	}, [form])

	const handleChange = (
		field: keyof CreateHomeForm,
		value: CreateHomeForm[keyof CreateHomeForm],
	) => {
		setField(field, value)

		const { success, error } =
			HomeFormValidation.shape[field as keyof typeof HomeFormValidation.shape].safeParse(value)

		if (!success) setError(field, error.issues[0].message)
		else setError(field, '')
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		startSubmittingTransition(async () => {
			const { success, error } = HomeFormValidation.safeParse(form)

			if (!success) {
				const newErrors: FormError<CreateHomeForm> = {}
				error.issues.forEach(issue => {
					const fieldName = issue.path[0] as keyof CreateHomeForm
					newErrors[fieldName] = issue.message
				})
				setErrors(newErrors)
				return
			}
			try {
				const { error, message } = await createHome({ data: form })

				if (error) throw new Error(message)

				resetForm()
				resetError()
			} catch (error) {
				console.error('Error creating home page:', error)
			}
		})
	}

	return (
		<form className='px-4 py-3 flex flex-col' onSubmit={handleSubmit} noValidate={true}>
			<div className='flex flex-col md:flex-row gap-2'>
				<div className='flex-1'>
					<label
						htmlFor='title'
						aria-label='Label for the home page title input'
						className='mb-1 block text-sm font-light text-neutral-200'>
						Title <span className='text-red-500'>*</span>
					</label>
					<input
						id='title'
						name='title'
						type='text'
						required={true}
						value={form.title}
						autoComplete='off'
						aria-required='true'
						aria-autocomplete='none'
						aria-label='Input for the home page title'
						placeholder={`e.g., "Welcome to Our Application"`}
						aria-placeholder={`e.g., "Welcome to Our Application"`}
						onChange={e => handleChange('title', e.target.value)}
						className='border border-neutral-600 rounded-md p-2 w-full outline-none placeholder:text-neutral-400 focus:border-accent focus:ring-1 focus:ring-accent'
					/>
					<div
						className={classNames(
							'mt-1 flex flex-col md:flex-row items-center md:justify-between justify-end',
							{ 'text-red-500': error.title, 'text-neutral-400': !error.title },
						)}>
						<span className='text-sm md:flex hidden'>{error.title}</span>
						<span className='text-xs'>{form.title.length}/20 characters</span>
					</div>
				</div>
				<div className='flex-1'>
					<label
						htmlFor='separator'
						aria-label='Label for the home page separator input'
						className='mb-1 block text-sm font-light text-neutral-200'>
						Separator <span className='text-red-500'>*</span>
					</label>
					<input
						id='separator'
						name='separator'
						type='text'
						required={true}
						value={form.separator}
						autoComplete='off'
						aria-required='true'
						aria-autocomplete='none'
						aria-label='Input for the home page separator'
						placeholder={`e.g., "-", "|", "/"`}
						aria-placeholder={`e.g., "-", "|", "/"`}
						onChange={e => handleChange('separator', e.target.value)}
						className='border border-neutral-600 rounded-md p-2 w-full outline-none placeholder:text-neutral-400 focus:border-accent focus:ring-1 focus:ring-accent'
					/>
					<div
						className={classNames(
							'mt-1 flex flex-col md:flex-row items-center md:justify-between justify-end',
							{ 'text-red-500': error.separator, 'text-neutral-400': !error.separator },
						)}>
						<span className='text-sm md:flex hidden'>{error.separator}</span>
						<span className='text-xs'>{form.separator.length}/1 character</span>
					</div>
				</div>
				<div className='flex-1'>
					<label
						htmlFor='subtitles'
						aria-label='Label for the home page subtitles input'
						className='mb-1 block text-sm font-light text-neutral-200'>
						Subtitles <span className='text-red-500'>*</span>{' '}
						<span className='text-xs font-extralight'>
							(Separate multiple subtitles with commas)
						</span>
					</label>
					<input
						id='subtitles'
						name='subtitles'
						type='text'
						required={true}
						value={form.subtitles.join(',')}
						autoComplete='off'
						aria-required='true'
						aria-autocomplete='none'
						aria-label='Input for the home page subtitles'
						placeholder={`e.g., "Your gateway to innovation, Excellence, Success"`}
						aria-placeholder={`e.g., "Your gateway to innovation, Excellence, Success"`}
						onChange={e =>
							handleChange(
								'subtitles',
								e.target.value ? e.target.value.split(',').map(item => item.trim()) : [],
							)
						}
						className='border border-neutral-600 rounded-md p-2 w-full outline-none placeholder:text-neutral-400 focus:border-accent focus:ring-1 focus:ring-accent'
					/>
					<div
						className={classNames(
							'mt-1 flex flex-col md:flex-row items-center md:justify-between justify-end',
							{ 'text-red-500': error.subtitles, 'text-neutral-400': !error.subtitles },
						)}>
						<span className='text-sm md:flex hidden'>{error.subtitles}</span>
						<span className='text-xs'>{form.subtitles.length} subtitles added</span>
					</div>
				</div>
			</div>
			<div className='mt-4 flex flex-col'>
				<div className='flex-1'>
					<label
						htmlFor='content'
						aria-label='Label for the home page content input'
						className='mb-1 block text-sm font-light text-neutral-200'>
						Content <span className='text-red-500'>*</span>
					</label>
					<textarea
						rows={5}
						id='content'
						name='content'
						required={true}
						value={form.content}
						aria-required='true'
						aria-label='Input for the home page content'
						placeholder={`e.g., "Discover amazing features and seamless experiences."`}
						aria-placeholder={`e.g., "Discover amazing features and seamless experiences."`}
						onChange={e => handleChange('content', e.target.value)}
						className='border border-neutral-600 rounded-md p-2 w-full resize-none outline-none placeholder:text-neutral-400 focus:border-accent focus:ring-1 focus:ring-accent'
					/>
					<div
						className={classNames(
							'mt-1 flex flex-col md:flex-row items-center md:justify-between justify-end',
							{ 'text-red-500': error.content, 'text-neutral-400': !error.content },
						)}>
						<span className='text-sm md:flex hidden'>{error.content}</span>
						<span className='text-xs'>{form.content.length}/500 characters</span>
					</div>
				</div>
			</div>
			<div className='mt-4 flex flex-col justify-center items-end'>
				<button
					type='submit'
					disabled={isDisabled || isSubmitting}
					className={classNames(
						'mt-2 border border-accent py-2 px-4 rounded-md text-sm font-medium max-w-fit justify-end text-accent transition-colors duration-200 outline-none hover:bg-accent hover:text-white',
						'disabled:cursor-not-allowed disabled:bg-neutral-600/50 disabled:text-neutral-400 disabled:border-neutral-600/50 hover:disabled:bg-neutral-600/50 hover:disabled:text-neutral-400 hover:disabled:border-neutral-600/50',
					)}>
					{isSubmitting ? 'Submitting...' : 'Create Home Page'}
				</button>
			</div>
		</form>
	)
}
