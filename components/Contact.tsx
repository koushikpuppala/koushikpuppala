'use client'

import { handleSubmit } from '@import/actions'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { object, string } from 'yup'

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

	const [submit, setSubmit] = useState({
		code: 0,
		message: '',
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
		setSubmit({
			code: state.statusCode,
			message: state.statusMessage,
		})

		if (state.statusCode === 200) {
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
		}
	}, [state])

	const validationSchema = object().shape({
		name: string().required('Name is required').min(3, 'Name must be at least 3 characters'),
		email: string().required('Email is required').email('Email is invalid'),
		subject: string().required('Subject is required').min(20, 'Subject must be at least 20 characters'),
		message: string().required('Message is required').min(50, 'Message must be at least 50 characters'),
	})

	const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target

		const error = await validationSchema
			.validateAt(name, { [name]: value })
			.then(() => '')
			.catch(err => err.message as string)

		setForm({
			value: { ...form.value, [name]: value },
			error: { ...form.error, [name]: error },
		})
	}

	return (
		<div className='h-full w-full rounded-2xl bg-black-100/60 p-8'>
			<form
				action={formActions}
				className='flex flex-col gap-8'>
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
						className='rounded-lg border-none bg-tertiary px-6 py-4 font-medium text-white outline-none selection:text-secondary placeholder:text-secondary'
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
						className='rounded-lg border-none bg-tertiary px-6 py-4 font-medium text-white outline-none placeholder:text-secondary'
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
						className='rounded-lg border-none bg-tertiary px-6 py-4 font-medium text-white outline-none placeholder:text-secondary'
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
						className='rounded-lg border-none bg-tertiary px-6 py-4 font-medium text-white outline-none placeholder:text-secondary'
					/>
					{form.error.message && <span className='mt-2 px-6 text-red-500'>{form.error.message}</span>}
				</label>
				<SubmitButton
					isDisabled={isDisabled}
					statusCode={submit.code}
				/>
				{submit.code === 500 && <span className='mt-2 px-6 text-red-500'>{submit.message}</span>}
				{submit.code === 400 && <span className='mt-2 px-6 text-yellow-500'>{submit.message}</span>}
				{submit.code === 200 && <span className='mt-2 px-6 text-green-500'>{submit.message}</span>}
			</form>
		</div>
	)
}

const SubmitButton = ({ isDisabled, statusCode }: { isDisabled: boolean; statusCode: number }) => {
	const { pending } = useFormStatus()

	return (
		<button
			type='submit'
			disabled={isDisabled}
			className={classNames(
				'rounded-lg border-none bg-tertiary px-6 py-4 font-medium text-white outline-none placeholder:text-secondary',
				{
					'cursor-not-allowed bg-secondary bg-opacity-50': isDisabled,
					'hover:bg-opacity-50': !isDisabled,
				},
			)}>
			{pending ? 'Submitting...' : statusCode === 200 ? 'Submitted' : 'Submit'}
		</button>
	)
}

export default ContactComponent
