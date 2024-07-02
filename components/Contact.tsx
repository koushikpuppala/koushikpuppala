'use client'

import classNames from 'classnames'
import { fromZodError } from 'zod-validation-error'
import { handleSubmit } from '@import/actions'
import { ContactFormSchema } from '@import/validation'
import { ContactFormType } from '@import/types'
import { useEffect, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'

const initialValue = {
	name: '',
	email: '',
	subject: '',
	message: '',
}

const ContactComponent = () => {
	const [isDisabled, setIsDisabled] = useState(true)
	const [form, setForm] = useState<ContactFormType>(initialValue)
	const [error, setError] = useState<ContactFormType>(initialValue)

	const initialState = {
		statusCode: 0,
		statusMessage: '',
	}

	const [state, formActions] = useFormState(handleSubmit, initialState)

	useEffect(() => {
		const { success } = ContactFormSchema.safeParse(form)

		setIsDisabled(!success)
	}, [form])

	useEffect(() => {
		if (state.statusCode === 200) setForm(initialValue)
	}, [state])

	const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target

		setForm({ ...form, [name]: value })

		const { success, error: zodError } =
			ContactFormSchema.shape[name as keyof typeof ContactFormSchema.shape].safeParse(value)

		if (!success) setError({ ...error, [name]: fromZodError(zodError).details[0].message })
		else setError({ ...error, [name]: '' })
	}

	return (
		<div className='h-full w-full rounded-2xl bg-black-100/60 p-8'>
			<form action={formActions} className='flex flex-col gap-8'>
				<label className='flex flex-col'>
					<span className='mb-4 font-medium text-white'>
						Your Name <span className='text-red-500'>*</span>
					</span>
					<input
						type='text'
						name='name'
						value={form.name}
						onChange={handleChange}
						placeholder="What's your name?"
						autoComplete='off'
						className='rounded-lg border-none bg-tertiary px-6 py-4 font-medium capitalize text-white outline-none selection:bg-tertiary selection:text-secondary placeholder:text-secondary focus:ring-1 focus:ring-accent'
					/>
					{error.name && <span className='mt-2 px-6 text-red-500'>{error.name}</span>}
				</label>
				<label className='flex flex-col'>
					<span className='mb-4 font-medium text-white'>
						Your email <span className='text-red-500'>*</span>
					</span>
					<input
						type='email'
						name='email'
						value={form.email}
						onChange={handleChange}
						placeholder="What's Your Email Address?"
						autoComplete='off'
						className='rounded-lg border-none bg-tertiary px-6 py-4 font-medium text-white outline-none selection:bg-tertiary selection:text-secondary placeholder:text-secondary focus:ring-1 focus:ring-accent'
					/>
					{error.email && <span className='mt-2 px-6 text-red-500'>{error.email}</span>}
				</label>
				<label className='flex flex-col'>
					<span className='mb-4 font-medium text-white'>
						Your Subject <span className='text-red-500'>*</span>
					</span>
					<input
						type='text'
						name='subject'
						value={form.subject}
						onChange={handleChange}
						placeholder='What is it about?'
						autoComplete='off'
						className='rounded-lg border-none bg-tertiary px-6 py-4 font-medium text-white outline-none selection:bg-tertiary selection:text-secondary placeholder:text-secondary focus:ring-1 focus:ring-accent'
					/>
					{error.subject && <span className='mt-2 px-6 text-red-500'>{error.subject}</span>}
				</label>
				<label className='flex flex-col'>
					<span className='mb-4 font-medium text-white'>
						Your Message <span className='text-red-500'>*</span>
					</span>
					<textarea
						rows={8}
						name='message'
						value={form.message}
						onChange={handleChange}
						placeholder='What you want to say?'
						autoComplete='off'
						className='resize-none rounded-lg border-none bg-tertiary px-6 py-4 font-medium text-white outline-none selection:bg-tertiary selection:text-secondary placeholder:text-secondary focus:ring-1 focus:ring-accent'
					/>
					{error.message && <span className='mt-2 px-6 text-red-500'>{error.message}</span>}
				</label>
				<div
					className={classNames({
						hidden: state.statusCode === 0,
						'flex items-center justify-center': state.statusCode !== 0,
					})}>
					{state.statusCode === 500 && <span className='text-red-500'>{state.statusMessage}</span>}
					{state.statusCode === 400 && <span className='text-yellow-500'>{state.statusMessage}</span>}
					{state.statusCode === 200 && <span className='text-green-500'>{state.statusMessage}</span>}
				</div>
				<SubmitButton isDisabled={isDisabled || state.statusCode === 200} />
			</form>
		</div>
	)
}

const SubmitButton = ({ isDisabled }: { isDisabled: boolean }) => {
	const { pending } = useFormStatus()

	return (
		<button
			type='submit'
			disabled={isDisabled}
			className={classNames(
				{
					'cursor-not-allowed bg-secondary': isDisabled,
					'bg-accent hover:bg-opacity-100': !isDisabled,
				},
				'rounded-lg border-none bg-opacity-50 px-6 py-4 font-medium text-white outline-none placeholder:text-secondary',
			)}>
			{pending ? (
				<div className='flex flex-row items-center justify-center gap-4 align-middle'>
					<div className='h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-l-transparent border-r-transparent' />
					Submitting...
				</div>
			) : (
				'Submit'
			)}
		</button>
	)
}

export default ContactComponent
