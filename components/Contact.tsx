'use client'

import { handleSubmit } from '@import/actions'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'

const ContactComponent = () => {
	const [isDisabled, setIsDisabled] = useState(true)
	const [form, setForm] = useState({
		value: {
			name: '',
			email: '',
			subject: '',
			message: '',
		},
		error: {
			name: '',
			email: '',
			subject: '',
			message: '',
		},
	})

	const initialState = {
		statusCode: 0,
		statusMessage: '',
	}

	const [state, formActions] = useFormState(handleSubmit, initialState)

	useEffect(() => {
		setIsDisabled(
			Object.values(form.error).some(err => err !== '') || Object.values(form.value).some(val => val === ''),
		)
	}, [form])

	useEffect(() => {
		if (state.statusCode === 200)
			setForm({
				value: {
					name: '',
					email: '',
					subject: '',
					message: '',
				},
				error: {
					name: '',
					email: '',
					subject: '',
					message: '',
				},
			})
	}, [state])

	const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target

		let error = ''
		const regex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/)

		switch (name) {
			case 'name':
				if (value.length == 0) error = 'Name is required'
				else if (value.length < 3) error = 'Name must be at least 3 characters'
				break
			case 'email':
				if (value.length == 0) error = 'Email is required'
				else if (!value.match(regex)) error = 'Email is invalid'
				break
			case 'subject':
				if (value.length == 0) error = 'Subject is required'
				else if (value.length < 20) error = 'Subject must be at least 20 characters'
				break
			case 'message':
				if (value.length == 0) error = 'Message is required'
				else if (value.length < 50) error = 'Message must be at least 50 characters'
				break
		}

		setForm({
			value: { ...form.value, [name]: value },
			error: { ...form.error, [name]: error },
		})
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
						value={form.value.name}
						onChange={handleChange}
						placeholder="What's your good name?"
						className='rounded-lg border-none bg-tertiary px-6 py-4 font-medium capitalize text-white outline-none selection:text-secondary placeholder:text-secondary focus:ring-1 focus:ring-accent'
					/>
					{form.error.name && <span className='mt-2 px-6 text-red-500'>{form.error.name}</span>}
				</label>
				<label className='flex flex-col'>
					<span className='mb-4 font-medium text-white'>
						Your email <span className='text-red-500'>*</span>
					</span>
					<input
						type='email'
						name='email'
						value={form.value.email}
						onChange={handleChange}
						placeholder="What's your email address?"
						className='rounded-lg border-none bg-tertiary px-6 py-4 font-medium text-white outline-none placeholder:text-secondary focus:ring-1 focus:ring-accent'
					/>
					{form.error.email && <span className='mt-2 px-6 text-red-500'>{form.error.email}</span>}
				</label>
				<label className='flex flex-col'>
					<span className='mb-4 font-medium text-white'>
						Your Subject <span className='text-red-500'>*</span>
					</span>
					<input
						type='text'
						name='subject'
						value={form.value.subject}
						onChange={handleChange}
						placeholder='What is it about?'
						className='rounded-lg border-none bg-tertiary px-6 py-4 font-medium capitalize text-white outline-none placeholder:text-secondary focus:ring-1 focus:ring-accent'
					/>
					{form.error.subject && <span className='mt-2 px-6 text-red-500'>{form.error.subject}</span>}
				</label>
				<label className='flex flex-col'>
					<span className='mb-4 font-medium text-white'>
						Your Message <span className='text-red-500'>*</span>
					</span>
					<textarea
						rows={8}
						name='message'
						value={form.value.message}
						onChange={handleChange}
						placeholder='What you want to say?'
						className='resize-none rounded-lg border-none bg-tertiary px-6 py-4 font-medium capitalize text-white outline-none placeholder:text-secondary focus:ring-1 focus:ring-accent'
					/>
					{form.error.message && <span className='mt-2 px-6 text-red-500'>{form.error.message}</span>}
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
				<SubmitButton isDisabled={isDisabled} />
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
