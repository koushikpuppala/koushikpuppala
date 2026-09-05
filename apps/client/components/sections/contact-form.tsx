'use client'

import { useState, useRef, type FormEvent, type ChangeEvent } from 'react'
import { Surface } from 'ui/surface'
import { SignalArrow } from 'ui/motion'
import {
	validateContactForm,
	submitContactInquiry,
	type ContactFormPayload,
	type ContactValidationErrors,
} from '../../lib/contact-data'

export interface ContactFormProps {
	className?: string
}

const INITIAL_VALUES: ContactFormPayload = {
	name: '',
	email: '',
	subject: '',
	message: '',
	url: '',
	source: 'website',
}

export const ContactForm = ({ className }: ContactFormProps) => {
	const [values, setValues] = useState<ContactFormPayload>(INITIAL_VALUES)
	const [errors, setErrors] = useState<ContactValidationErrors>({})
	const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
	const [feedbackMessage, setFeedbackMessage] = useState('')

	const nameInputRef = useRef<HTMLInputElement>(null)
	const emailInputRef = useRef<HTMLInputElement>(null)
	const subjectInputRef = useRef<HTMLInputElement>(null)
	const messageInputRef = useRef<HTMLTextAreaElement>(null)

	const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target
		setValues(prev => ({ ...prev, [name]: value }))

		// Clear field-specific error as user types
		if (errors[name as keyof ContactValidationErrors]) {
			setErrors(prev => ({ ...prev, [name]: undefined }))
		}
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()

		// Prevent duplicate concurrent submissions
		if (status === 'submitting') return

		// Run local validation
		const validation = validateContactForm(values)
		if (!validation.isValid) {
			setErrors(validation.errors)

			// Accessible auto-focus on first invalid field
			if (validation.errors.name) {
				nameInputRef.current?.focus()
			} else if (validation.errors.email) {
				emailInputRef.current?.focus()
			} else if (validation.errors.subject) {
				subjectInputRef.current?.focus()
			} else if (validation.errors.message) {
				messageInputRef.current?.focus()
			}
			return
		}

		setStatus('submitting')
		setFeedbackMessage('')

		const result = await submitContactInquiry(values)

		if (result.success) {
			setStatus('success')
			setFeedbackMessage(result.message)
			setValues(INITIAL_VALUES)
			setErrors({})
		} else {
			setStatus('error')
			setFeedbackMessage(result.message)
			if (result.errors) {
				setErrors(result.errors)
			}
			// User values are preserved in state so nothing is lost
		}
	}

	const handleReset = () => {
		setStatus('idle')
		setFeedbackMessage('')
		setErrors({})
	}

	return (
		<Surface
			variant='bordered'
			className={`p-4 sm:p-8 rounded-xl sm:rounded-2xl border border-border/80 bg-surface/60 backdrop-blur-md space-y-6 ${
				className || ''
			}`}>
			{/* Terminal Header & Encryption Badge */}
			<div className='flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 border-b border-border/60 pb-5'>
				<div className='flex items-center gap-2'>
					<span className='font-mono text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest text-muted-foreground font-semibold break-words'>
						DISPATCH TERMINAL {'//'} ENCRYPTED
					</span>
				</div>

				<div className='flex items-center gap-2'>
					<span className='h-2 w-2 rounded-full bg-signal animate-pulse' aria-hidden='true' />
					<span className='font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-signal font-medium'>
						STATUS: ONLINE
					</span>
				</div>
			</div>

			{/* Success State View */}
			{status === 'success' ? (
				<div
					className='py-8 sm:py-12 space-y-6 text-center animate-in fade-in zoom-in-95 duration-300'
					role='status'
					aria-live='polite'>
					<div className='mx-auto h-16 w-16 rounded-2xl border border-signal/40 bg-signal/10 flex items-center justify-center text-signal shadow-lg shadow-signal/10'>
						<svg
							className='h-8 w-8'
							aria-hidden='true'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2.5'
							strokeLinecap='round'
							strokeLinejoin='round'>
							<polyline points='20 6 9 17 4 12' />
						</svg>
					</div>

					<div className='space-y-2 max-w-md mx-auto'>
						<h4 className='text-xl sm:text-2xl font-display font-semibold tracking-tight text-foreground'>
							Transmission Confirmed
						</h4>
						<p className='text-sm text-muted-foreground leading-relaxed'>
							{feedbackMessage ||
								'Your dispatch has been successfully recorded in the inbox. I review all inquiries directly and will follow up shortly.'}
						</p>
					</div>

					<div className='pt-2'>
						<button
							type='button'
							onClick={handleReset}
							className='inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/80 bg-surface hover:bg-surface-strong hover:text-foreground text-muted-foreground font-mono text-xs font-semibold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal'>
							<span>TRANSMIT ANOTHER MESSAGE</span>
							<SignalArrow size={12} />
						</button>
					</div>
				</div>
			) : (
				/* Interactive Form View */
				<form onSubmit={handleSubmit} noValidate className='space-y-5'>
					{/* Error Alert Banner */}
					{status === 'error' && (
						<div
							className='p-4 rounded-xl border border-red-500/40 bg-red-500/10 text-red-400 text-xs space-y-2'
							role='alert'
							aria-live='assertive'>
							<div className='flex items-center gap-2 font-mono font-semibold uppercase tracking-wider text-red-300'>
								<svg
									className='h-4 w-4 shrink-0'
									aria-hidden='true'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'>
									<circle cx='12' cy='12' r='10' />
									<line x1='12' y1='8' x2='12' y2='12' />
									<line x1='12' y1='16' x2='12.01' y2='16' />
								</svg>
								<span>TRANSMISSION NOTICE</span>
							</div>
							<p className='leading-relaxed text-red-300/90'>
								{feedbackMessage ||
									'A connection error occurred while sending your dispatch. Your message draft has been preserved below.'}
							</p>
							<div className='pt-1 flex flex-wrap gap-2'>
								<a
									href={`mailto:koushikpuppala@koushikpuppala.com?subject=${encodeURIComponent(
										values.subject || 'Portfolio Inquiry',
									)}&body=${encodeURIComponent(values.message)}`}
									className='inline-flex items-center gap-1.5 underline underline-offset-4 hover:text-red-200 font-mono text-[11px] font-medium'>
									<span>SEND VIA EMAIL CLIENT INSTEAD →</span>
								</a>
							</div>
						</div>
					)}

					{/* Anti-spam Honeypot (Hidden) */}
					<input
						type='text'
						name='url'
						value={values.url}
						onChange={handleChange}
						tabIndex={-1}
						autoComplete='off'
						className='hidden'
						aria-hidden='true'
					/>

					{/* Row 1: Name and Return Email */}
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
						{/* Field: Name */}
						<div className='space-y-1.5'>
							<label
								htmlFor='contact-name'
								className='block font-mono text-xs uppercase tracking-wider text-muted-foreground'>
								NAME &amp; ORGANIZATION <span className='text-signal'>*</span>
							</label>
							<input
								ref={nameInputRef}
								id='contact-name'
								type='text'
								name='name'
								value={values.name}
								onChange={handleChange}
								disabled={status === 'submitting'}
								placeholder='e.g. Alex Morgan / Acme Corp'
								aria-required='true'
								aria-invalid={Boolean(errors.name)}
								aria-describedby={errors.name ? 'contact-name-error' : undefined}
								className={`w-full rounded-xl border bg-surface/50 px-4 py-3 text-base sm:text-sm text-foreground placeholder:text-muted-foreground/50 transition-all duration-200 focus:bg-surface focus:outline-none focus:ring-1 ${
									errors.name
										? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/30'
										: 'border-border/80 focus:border-signal focus:ring-signal'
								}`}
							/>
							{errors.name && (
								<p
									id='contact-name-error'
									className='font-mono text-xs text-red-400 mt-1'
									role='alert'>
									{errors.name}
								</p>
							)}
						</div>

						{/* Field: Email */}
						<div className='space-y-1.5'>
							<label
								htmlFor='contact-email'
								className='block font-mono text-xs uppercase tracking-wider text-muted-foreground'>
								RETURN EMAIL ADDRESS <span className='text-signal'>*</span>
							</label>
							<input
								ref={emailInputRef}
								id='contact-email'
								type='email'
								name='email'
								value={values.email}
								onChange={handleChange}
								disabled={status === 'submitting'}
								placeholder='e.g. alex@example.com'
								aria-required='true'
								aria-invalid={Boolean(errors.email)}
								aria-describedby={errors.email ? 'contact-email-error' : undefined}
								className={`w-full rounded-xl border bg-surface/50 px-4 py-3 text-base sm:text-sm text-foreground placeholder:text-muted-foreground/50 transition-all duration-200 focus:bg-surface focus:outline-none focus:ring-1 ${
									errors.email
										? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/30'
										: 'border-border/80 focus:border-signal focus:ring-signal'
								}`}
							/>
							{errors.email && (
								<p
									id='contact-email-error'
									className='font-mono text-xs text-red-400 mt-1'
									role='alert'>
									{errors.email}
								</p>
							)}
						</div>
					</div>

					{/* Row 2: Subject */}
					<div className='space-y-1.5'>
						<label
							htmlFor='contact-subject'
							className='block font-mono text-xs uppercase tracking-wider text-muted-foreground'>
							INQUIRY SUBJECT <span className='text-signal'>*</span>
						</label>
						<input
							ref={subjectInputRef}
							id='contact-subject'
							type='text'
							name='subject'
							value={values.subject}
							onChange={handleChange}
							disabled={status === 'submitting'}
							placeholder='e.g. Distributed Systems Architecture / Full-Stack Project'
							aria-required='true'
							aria-invalid={Boolean(errors.subject)}
							aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
							className={`w-full rounded-xl border bg-surface/50 px-4 py-3 text-base sm:text-sm text-foreground placeholder:text-muted-foreground/50 transition-all duration-200 focus:bg-surface focus:outline-none focus:ring-1 ${
								errors.subject
									? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/30'
									: 'border-border/80 focus:border-signal focus:ring-signal'
							}`}
						/>
						{errors.subject && (
							<p
								id='contact-subject-error'
								className='font-mono text-xs text-red-400 mt-1'
								role='alert'>
								{errors.subject}
							</p>
						)}
					</div>

					{/* Row 3: Message */}
					<div className='space-y-1.5'>
						<div className='flex items-center justify-between'>
							<label
								htmlFor='contact-message'
								className='block font-mono text-xs uppercase tracking-wider text-muted-foreground'>
								TRANSMISSION BODY <span className='text-signal'>*</span>
							</label>
							<span
								className={`font-mono text-[11px] ${
									values.message.length >= 10 ? 'text-signal' : 'text-muted-foreground/60'
								}`}>
								{values.message.length} / 5000
							</span>
						</div>
						<textarea
							ref={messageInputRef}
							id='contact-message'
							name='message'
							rows={5}
							value={values.message}
							onChange={handleChange}
							disabled={status === 'submitting'}
							placeholder='Detail your engineering scope, architecture goals, project timeline, or questions...'
							aria-required='true'
							aria-invalid={Boolean(errors.message)}
							aria-describedby={errors.message ? 'contact-message-error' : undefined}
							className={`w-full resize-y rounded-xl border bg-surface/50 px-4 py-3 text-base sm:text-sm text-foreground placeholder:text-muted-foreground/50 transition-all duration-200 focus:bg-surface focus:outline-none focus:ring-1 ${
								errors.message
									? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/30'
									: 'border-border/80 focus:border-signal focus:ring-signal'
							}`}
						/>
						{errors.message && (
							<p
								id='contact-message-error'
								className='font-mono text-xs text-red-400 mt-1'
								role='alert'>
								{errors.message}
							</p>
						)}
					</div>

					{/* Submit Action Controls */}
					<div className='pt-2 flex flex-col sm:flex-row items-center justify-between gap-4'>
						<button
							type='submit'
							disabled={status === 'submitting'}
							className='group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-signal text-signal-foreground font-mono text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:opacity-95 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-signal/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal'>
							{status === 'submitting' ? (
								<>
									<svg
										className='animate-spin -ml-1 mr-2 h-4 w-4 text-signal-foreground'
										aria-hidden='true'
										fill='none'
										viewBox='0 0 24 24'>
										<circle
											className='opacity-25'
											cx='12'
											cy='12'
											r='10'
											stroke='currentColor'
											strokeWidth='4'
										/>
										<path
											className='opacity-75'
											fill='currentColor'
											d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
										/>
									</svg>
									<span>TRANSMITTING DISPATCH...</span>
								</>
							) : (
								<>
									<svg
										className='w-4 h-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5'
										aria-hidden='true'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'>
										<line x1='22' y1='2' x2='11' y2='13' />
										<polygon points='22 2 15 22 11 13 2 9 22 2' />
									</svg>
									<span>TRANSMIT MESSAGE</span>
									<SignalArrow
										size={13}
										className='transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5'
									/>
								</>
							)}
						</button>

						<div className='text-center sm:text-right'>
							<span className='font-mono text-[11px] text-muted-foreground'>
								Direct inbox logging • 256-bit TLS transport
							</span>
						</div>
					</div>
				</form>
			)}
		</Surface>
	)
}
