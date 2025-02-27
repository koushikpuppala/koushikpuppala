'use client'

import Link from 'next/link'
import Form from 'next/form'
import classNames from 'classnames'
import { ContactFormType } from '@import/types'
import { useReCaptcha } from 'next-recaptcha-v3'
import { captureException } from '@sentry/nextjs'
import { fromZodError } from 'zod-validation-error'
import { ContactFormSchema } from '@import/validation'
import { useActionState, useEffect, useState } from 'react'
import { handleReCaptcha, handleSubmit } from '@import/actions'
import { FORM_INITIAL_STATE, FORM_INITIAL_VALUE } from '@import/constant'

const Contact = () => {
	const { executeRecaptcha } = useReCaptcha()
	const [isDisabled, setIsDisabled] = useState(true)
	const [form, setForm] = useState<ContactFormType>(FORM_INITIAL_VALUE)
	const [error, setError] = useState<ContactFormType>(FORM_INITIAL_VALUE)
	const [state, formActions, isSubmitting] = useActionState(handleSubmit, FORM_INITIAL_STATE)

	useEffect(() => {
		const { success } = ContactFormSchema.safeParse(form)

		setIsDisabled(!success)
	}, [form])

	useEffect(() => {
		if (state.statusCode !== 200) return

		setForm(FORM_INITIAL_VALUE)
		setIsDisabled(state.statusCode === 200)
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
		<div className='bg-black-100/60 h-full w-full rounded-2xl p-8'>
			<Form
				action={async payload => {
					try {
						const token = await executeRecaptcha('contact_form_submit')

						const success = await handleReCaptcha(token)

						if (success) formActions(payload)
						else captureException(new Error('Failed to verify reCaptcha'))
					} catch (error) {
						captureException(error)
						console.error(error)
					}
				}}
				className='flex flex-col gap-8'>
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
						className='bg-tertiary selection:bg-tertiary selection:text-secondary placeholder:text-secondary focus:ring-accent rounded-lg border-none px-6 py-4 font-medium text-white capitalize outline-none focus:ring-1'
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
						className='bg-tertiary selection:bg-tertiary selection:text-secondary placeholder:text-secondary focus:ring-accent rounded-lg border-none px-6 py-4 font-medium text-white outline-none focus:ring-1'
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
						className='bg-tertiary selection:bg-tertiary selection:text-secondary placeholder:text-secondary focus:ring-accent rounded-lg border-none px-6 py-4 font-medium text-white outline-none focus:ring-1'
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
						className='bg-tertiary selection:bg-tertiary selection:text-secondary placeholder:text-secondary focus:ring-accent resize-none rounded-lg border-none px-6 py-4 font-medium text-white outline-none focus:ring-1'
					/>
					{error.message && <span className='mt-2 px-6 text-red-500'>{error.message}</span>}
				</label>
				<div
					className={classNames({
						hidden: state.statusCode === 0,
						'flex items-center justify-center': state.statusCode !== 0,
					})}>
					{state.statusCode === 500 && <span className='text-red-500'>{state.statusMessage}</span>}
					{state.statusCode === 200 && (
						<span className='text-green-500'>{state.statusMessage}</span>
					)}
				</div>

				<button
					type='submit'
					disabled={isDisabled || isSubmitting}
					className={classNames(
						{
							'bg-secondary cursor-not-allowed': isDisabled,
							'bg-accent hover:bg-opacity-100': !isDisabled,
						},
						'bg-opacity-50 placeholder:text-secondary rounded-lg border-none px-6 py-4 font-medium text-white outline-none',
					)}>
					{isSubmitting ? (
						<div className='flex flex-row items-center justify-center gap-4 align-middle'>
							<div className='h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-r-transparent border-l-transparent' />
							Submitting...
						</div>
					) : (
						'Submit'
					)}
				</button>
			</Form>
			<span className='text-xs'>
				<span className='text-red-500'>* </span>
				Protected by reCAPTCHA. Google{' '}
				<Link className='text-blue-400' target='_blank' href='https://policies.google.com/privacy'>
					Privacy Policy
				</Link>
				{' & '}
				<Link className='text-blue-400' target='_blank' href='https://policies.google.com/terms'>
					Terms of Service
				</Link>{' '}
				apply.
			</span>
		</div>
	)
}

export default Contact
