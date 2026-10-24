import type { ContactFormProps } from 'types/components/client'
import Link from 'next/link'
import { Input } from 'ui/input'
import { Button } from 'ui/button'
import { Textarea } from 'ui/textarea'
import { classNames } from 'utils/classNames'
import { Check, RefreshCw, Send, Zap } from 'components/icons'
import { TopicPicker } from 'components/contact/topic-picker'
import { DeliveryNotice } from 'components/contact/delivery-notice'
import { ContactInputField } from 'components/contact/contact-input-field'
import { FIELD, MIN_MESSAGE } from 'components/contact/contact-options'

const INVALID = 'border-destructive focus-ring:ring-destructive'

const POLICY_LINK = 'hover:text-foreground underline underline-offset-2'

export const ContactForm = ({ form, directEmail }: ContactFormProps) => {
	const { values, errors, change, blur } = form
	const ready = values.message.length >= MIN_MESSAGE

	const describedBy = (field: 'name' | 'email' | 'message') =>
		errors[field] ? `${field}-error` : undefined

	return (
		<form
			onSubmit={form.submit}
			noValidate
			className='panel space-y-7 rounded-2xl p-7 sm:p-10'
			aria-label='Contact form'>
			<div className='flex items-center justify-between gap-4'>
				<div className='flex items-center gap-2'>
					<Zap className='text-signal-ink size-4' />
					<span className='font-display text-foreground text-lg font-semibold tracking-tight whitespace-nowrap'>
						Transmit Inquiry
					</span>
				</div>
				<span className='text-muted-foreground text-xs'>Goes straight to my inbox</span>
			</div>

			{form.submitError ? (
				<DeliveryNotice
					error={form.submitError}
					directEmail={directEmail}
					values={values}
					copied={form.copied}
					onCopy={form.copyDraft}
				/>
			) : null}

			<div className='hidden' aria-hidden>
				<label htmlFor='company'>Company (leave blank)</label>
				<input id='company' name='company' tabIndex={-1} autoComplete='off' />
			</div>

			<TopicPicker selected={form.selectedTopic} onSelect={form.selectTopic} />

			<div className='grid gap-6 sm:grid-cols-2'>
				<ContactInputField id='name' label='Your Name' required error={errors.name}>
					<Input
						id='name'
						name='name'
						value={values.name}
						onChange={e => change('name', e.target.value)}
						onBlur={() => blur('name')}
						placeholder='Jane Doe'
						autoComplete='name'
						required
						aria-invalid={Boolean(errors.name)}
						aria-describedby={describedBy('name')}
						className={classNames(FIELD, errors.name && INVALID)}
					/>
				</ContactInputField>

				<ContactInputField id='email' label='Your Email' required error={errors.email}>
					<Input
						id='email'
						name='email'
						type='email'
						value={values.email}
						onChange={e => change('email', e.target.value)}
						onBlur={() => blur('email')}
						placeholder='name@company.com'
						autoComplete='email'
						required
						aria-invalid={Boolean(errors.email)}
						aria-describedby={describedBy('email')}
						className={classNames(FIELD, errors.email && INVALID)}
					/>
				</ContactInputField>
			</div>

			<ContactInputField
				id='subject'
				label='Subject / Inquiry Title'
				aside={
					<span className='text-muted-foreground text-xs'>
						Optional (defaults to &ldquo;Portfolio Inquiry&rdquo;)
					</span>
				}>
				<Input
					id='subject'
					name='subject'
					value={values.subject}
					onChange={e => change('subject', e.target.value)}
					placeholder='e.g. Full-Stack Web App Build or Engineering Consultation'
					className={FIELD}
					maxLength={200}
				/>
			</ContactInputField>

			<ContactInputField
				id='message'
				label='Message & Context'
				required
				error={errors.message}
				aside={
					<span
						className={classNames(
							'text-xs transition-colors',
							ready ? 'text-success font-medium' : 'text-muted-foreground',
						)}>
						{ready ? (
							<span className='inline-flex items-center gap-1'>
								<Check className='text-success size-3' />
								{values.message.length} chars (ready)
							</span>
						) : (
							<span>
								{values.message.length} / {MIN_MESSAGE} min characters
							</span>
						)}
					</span>
				}>
				<Textarea
					id='message'
					name='message'
					value={values.message}
					onChange={e => change('message', e.target.value)}
					onBlur={() => blur('message')}
					rows={7}
					placeholder={
						form.selectedTopic?.placeholder ??
						'Share details regarding the opportunity, scope, challenges, or goals…'
					}
					required
					aria-invalid={Boolean(errors.message)}
					aria-describedby={describedBy('message')}
					className={classNames(
						'min-h-40 resize-y px-3.5 py-3 text-base md:text-[0.9375rem]',
						errors.message && INVALID,
					)}
				/>
			</ContactInputField>

			<div className='space-y-3 pt-2'>
				<Button
					type='submit'
					size='lg'
					variant='signal'
					className='h-12 w-full cursor-pointer text-sm font-semibold tracking-wide'
					disabled={form.loading}>
					{form.loading ? (
						<>
							<RefreshCw className='size-4 animate-spin' />
							<span>Transmitting to Server…</span>
						</>
					) : (
						<>
							<span>Send Message</span>
							<Send className='size-4' />
						</>
					)}
				</Button>

				{form.captcha ? (
					<p className='text-muted-foreground px-1 text-xs leading-relaxed'>
						Protected by reCAPTCHA. The Google{' '}
						<Link
							href='https://policies.google.com/privacy'
							target='_blank'
							rel='noopener noreferrer'
							className={POLICY_LINK}>
							Privacy Policy
						</Link>{' '}
						and{' '}
						<Link
							href='https://policies.google.com/terms'
							target='_blank'
							rel='noopener noreferrer'
							className={POLICY_LINK}>
							Terms of Service
						</Link>{' '}
						apply.
					</p>
				) : null}
			</div>
		</form>
	)
}
