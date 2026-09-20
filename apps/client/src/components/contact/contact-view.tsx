'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
	ArrowUpRight,
	Check,
	CheckCircle2,
	Clock,
	Copy,
	Mail,
	MapPin,
	RefreshCw,
	Send,
	ShieldCheck,
	Sparkles,
	Zap,
} from 'components/icons'
import { z } from 'zod'
import Link from 'next/link'
import { SiteShell } from 'components/site-shell'
import { PulseDot, Reveal, Section } from 'components/primitives'
import { Button } from 'components/ui/button'
import { Input } from 'components/ui/input'
import { Label } from 'components/ui/label'
import { Textarea } from 'components/ui/textarea'
import { socialIcons } from 'components/home/home-sections'
import { classNames } from 'utils/classNames'
import type { PublishedSocial } from 'types/models'

const contactSchema = z.object({
	name: z.string().min(2, 'Please enter your name (at least 2 characters).'),
	email: z.string().email('Please enter a valid email address (e.g. you@domain.com).'),
	subject: z.string().min(3, 'Subject must be at least 3 characters.').max(200),
	message: z.string().min(20, 'Please provide at least 20 characters for meaningful context.'),
})

type FieldErrors = Partial<Record<keyof z.infer<typeof contactSchema>, string>>

type TopicOption = {
	id: string
	label: string
	icon: string
	subject: string
	placeholder: string
}

const TOPIC_PRESETS: TopicOption[] = [
	{
		id: 'fullstack',
		label: 'Full-Stack Project',
		icon: '🚀',
		subject: 'Project Inquiry: Web / Full-Stack Application',
		placeholder: 'Tell me about the product scope, target timeline, tech stack, and goals…',
	},
	{
		id: 'architecture',
		label: 'System Architecture',
		icon: '🏛️',
		subject: 'Advisory: System Design & Scalability',
		placeholder:
			'Describe your current architecture challenges, database scaling, or infrastructure bottlenecks…',
	},
	{
		id: 'role',
		label: 'Engineering Role',
		icon: '💼',
		subject: 'Opportunity: Engineering Role Discussion',
		placeholder: 'Share the role details, team mission, technologies used, and compensation range…',
	},
	{
		id: 'consultation',
		label: 'Tech Consultation',
		icon: '⚡',
		subject: 'Consultation: Technical Review & Advisory',
		placeholder:
			'What specific technical question, code audit, or technology choice would you like to discuss?',
	},
	{
		id: 'general',
		label: 'General / Hello',
		icon: '👋',
		subject: 'General Inquiry: Hello Koushik',
		placeholder: 'Leave a note, share feedback, or just say hi…',
	},
]

const OFFICIAL_EMAIL = 'koushikpuppala@koushikpuppala.com'

export function ContactView({ socials }: { socials: PublishedSocial[] }) {
	// Controlled form state
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [subject, setSubject] = useState('')
	const [message, setMessage] = useState('')
	const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
	const [touched, setTouched] = useState<Record<string, boolean>>({})

	// Feedback & Submission state
	const [errors, setErrors] = useState<FieldErrors>({})
	const [sent, setSent] = useState(false)
	const [submissionReceipt, setSubmissionReceipt] = useState<{
		id?: string
		timestamp: string
		name: string
		email: string
		subject: string
	} | null>(null)
	const [loading, setLoading] = useState(false)
	const [submitError, setSubmitError] = useState<string | null>(null)

	// Interactive telemetry state
	const [copiedEmail, setCopiedEmail] = useState(false)
	const [copiedDraft, setCopiedDraft] = useState(false)
	const [istTime, setIstTime] = useState<string>('')
	const [isWorkHours, setIsWorkHours] = useState<boolean>(true)
	const mountedAt = useRef(0)

	useEffect(() => {
		mountedAt.current = Date.now()

		function updateTime() {
			try {
				const now = new Date()
				const formatter = new Intl.DateTimeFormat('en-US', {
					timeZone: 'Asia/Kolkata',
					hour: 'numeric',
					minute: '2-digit',
					second: '2-digit',
					hour12: true,
				})
				setIstTime(formatter.format(now))

				// Calculate working hours in IST (9am - 10pm)
				const istHour = parseInt(
					new Intl.DateTimeFormat('en-US', {
						timeZone: 'Asia/Kolkata',
						hour: 'numeric',
						hour12: false,
					}).format(now),
					10,
				)
				setIsWorkHours(istHour >= 9 && istHour < 22)
			} catch {
				setIstTime('IST (UTC+5:30)')
			}
		}

		updateTime()
		const timer = setInterval(updateTime, 1000)
		return () => clearInterval(timer)
	}, [])

	// Select Topic Preset
	function handleSelectTopic(topic: TopicOption) {
		if (selectedTopic === topic.id) {
			setSelectedTopic(null)
			setSubject('')
		} else {
			setSelectedTopic(topic.id)
			setSubject(topic.subject)
		}
	}

	// Live validation helper
	function validateField(field: keyof z.infer<typeof contactSchema>, val: string) {
		if (!touched[field]) return

		const data = {
			name: field === 'name' ? val : name,
			email: field === 'email' ? val : email,
			subject: field === 'subject' ? val : subject || 'Portfolio Inquiry',
			message: field === 'message' ? val : message,
		}

		const result = contactSchema.safeParse(data)
		if (!result.success) {
			const issue = result.error.issues.find(i => i.path[0] === field)
			setErrors(prev => ({ ...prev, [field]: issue ? issue.message : undefined }))
		} else {
			setErrors(prev => ({ ...prev, [field]: undefined }))
		}
	}

	// 1-Click Copy Official Email
	async function handleCopyEmail() {
		try {
			await navigator.clipboard.writeText(OFFICIAL_EMAIL)
			setCopiedEmail(true)
			setTimeout(() => setCopiedEmail(false), 2200)
		} catch {
			/* clipboard fallback */
		}
	}

	// 1-Click Copy Draft Message
	async function handleCopyDraft() {
		try {
			const text = `From: ${name} <${email}>\nSubject: ${subject || 'Portfolio Inquiry'}\n\n${message}`
			await navigator.clipboard.writeText(text)
			setCopiedDraft(true)
			setTimeout(() => setCopiedDraft(false), 2200)
		} catch {
			/* clipboard fallback */
		}
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setSubmitError(null)

		const form = new FormData(event.currentTarget)

		// Anti-spam: hidden honeypot + minimum human dwell time
		if (String(form.get('company') ?? '')) return
		if (Date.now() - mountedAt.current < 2500) {
			setSubmitError('Please take a moment before submitting to ensure clean delivery.')
			return
		}

		const finalSubject = subject.trim() || 'Portfolio Inquiry'
		const parsed = contactSchema.safeParse({
			name: name.trim(),
			email: email.trim(),
			subject: finalSubject,
			message: message.trim(),
		})

		if (!parsed.success) {
			const fieldErrors: FieldErrors = {}
			for (const issue of parsed.error.issues) {
				fieldErrors[issue.path[0] as keyof FieldErrors] = issue.message
			}
			setErrors(fieldErrors)
			setTouched({ name: true, email: true, subject: true, message: true })
			return
		}

		setErrors({})
		setLoading(true)

		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: parsed.data.name,
					email: parsed.data.email,
					subject: parsed.data.subject,
					message: parsed.data.message,
				}),
			})

			const data = await res.json().catch(() => null)

			if (!res.ok || data?.success === false) {
				throw new Error(
					data?.message || `HTTP ${res.status}: The server was unable to register your dispatch.`,
				)
			}

			setSubmissionReceipt({
				id: data?.id || `KP-${Math.floor(100000 + Math.random() * 900000)}`,
				timestamp: new Date().toLocaleTimeString('en-US', {
					hour: 'numeric',
					minute: '2-digit',
					day: 'numeric',
					month: 'short',
				}),
				name: parsed.data.name,
				email: parsed.data.email,
				subject: parsed.data.subject,
			})
			setSent(true)
		} catch (err) {
			setSubmitError(
				err instanceof Error
					? err.message
					: 'The dispatch terminal could not connect to the backend service. You can use the direct email link below.',
			)
		} finally {
			setLoading(false)
		}
	}

	function handleResetForm() {
		setSent(false)
		setSubmissionReceipt(null)
		setName('')
		setEmail('')
		setSubject('')
		setMessage('')
		setSelectedTopic(null)
		setTouched({})
		setErrors({})
		setSubmitError(null)
	}

	const charCount = message.length
	const minChars = 20
	const hasMinChars = charCount >= minChars

	return (
		<SiteShell socials={socials}>
			<Section className='relative overflow-hidden pt-28 pb-24 sm:pt-32 lg:pt-36 lg:pb-32'>
				<div
					className='grid-fine mask-fade-b pointer-events-none absolute inset-0 opacity-60'
					aria-hidden
				/>
				<div
					className='pointer-events-none absolute -top-52 -left-32 size-136 rounded-full opacity-60 blur-3xl'
					style={{ background: 'var(--glow-signal)' }}
					aria-hidden
				/>

				<div className='container-page relative grid gap-14 lg:grid-cols-12 lg:gap-16'>
					<div className='space-y-8 lg:col-span-5'>
						<div>
							<div className='enter-item text-foreground flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.16em] uppercase'>
								<PulseDot />
								Transmission Channel
							</div>
							<h1 className='text-display mt-6 text-[2.5rem] leading-[1.02] sm:text-5xl lg:text-[3.5rem]'>
								<span className='enter-item enter-delay-2 block'>Let&apos;s talk</span>
								<span className='enter-item enter-delay-3 text-ink-fade block'>about it</span>
							</h1>
							<p className='enter-item enter-delay-4 text-muted-foreground mt-6 max-w-md leading-relaxed'>
								Whether you have a full-stack product build, an architecture challenge, or an
								engineering role — send a note and I&apos;ll get back to you with thoughtful
								context.
							</p>
						</div>

						<div className='enter-item enter-delay-5 border-border bg-surface/60 space-y-4 rounded-2xl border p-5 backdrop-blur-sm'>
							<div className='border-border flex items-center justify-between border-b pb-3'>
								<div className='text-muted-foreground flex items-center gap-2 font-mono text-[0.6875rem] tracking-wider uppercase'>
									<Clock className='text-signal-ink size-3.5' />
									<span>Live Telemetry</span>
								</div>
								<span className='border-border bg-background text-foreground inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[0.625rem]'>
									<span
										className={classNames(
											'size-1.5 rounded-full',
											isWorkHours ? 'bg-success animate-pulse' : 'bg-warning',
										)}
									/>
									{isWorkHours ? 'Active Hours' : 'After Hours'}
								</span>
							</div>

							<div className='grid grid-cols-2 gap-4 font-mono text-xs'>
								<div>
									<span className='text-muted-foreground block text-[0.625rem] uppercase'>
										Local Time (IST)
									</span>
									<span className='text-foreground mt-1 block font-semibold tracking-tight'>
										{istTime || 'Loading…'}
									</span>
								</div>
								<div>
									<span className='text-muted-foreground block text-[0.625rem] uppercase'>
										Typical Response
									</span>
									<span className='text-signal-ink mt-1 block font-semibold'>&lt; 24 Hours</span>
								</div>
							</div>

							<div className='text-muted-foreground flex items-center gap-2 pt-1 text-[0.6875rem]'>
								<MapPin className='text-signal-ink size-3.5 shrink-0' />
								<span>Bengaluru &amp; Raichur, Karnataka, India (UTC+5:30)</span>
							</div>
						</div>

						<div className='enter-item enter-delay-5 border-border bg-surface/40 space-y-3 rounded-2xl border p-5'>
							<span className='text-eyebrow block'>Direct Transmission Line</span>
							<div className='border-border bg-background/80 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5'>
								<div className='flex min-w-0 items-center gap-2.5'>
									<Mail className='text-signal-ink size-4 shrink-0' />
									<span className='text-foreground truncate font-mono text-xs'>
										{OFFICIAL_EMAIL}
									</span>
								</div>
								<button
									type='button'
									onClick={handleCopyEmail}
									title='Copy email address to clipboard'
									className='border-border bg-surface text-muted-foreground hover:border-signal/50 hover:text-foreground inline-flex items-center gap-1 rounded-lg border px-2 py-1 font-mono text-[0.625rem] transition-colors active:scale-95'>
									{copiedEmail ? (
										<>
											<Check className='text-success size-3' />
											<span className='text-success font-medium'>Copied!</span>
										</>
									) : (
										<>
											<Copy className='size-3' />
											<span>Copy</span>
										</>
									)}
								</button>
							</div>
							<div className='text-muted-foreground flex items-center gap-2 text-[0.6875rem]'>
								<ShieldCheck className='text-signal-ink size-3.5 shrink-0' />
								<span>256-bit TLS encrypted directly to PostgreSQL database inbox.</span>
							</div>
						</div>

						<div className='enter-item enter-delay-6 space-y-2'>
							<span className='text-eyebrow block'>Verified Communication Channels</span>
							<ul className='divide-border border-border bg-surface/30 divide-y rounded-2xl border px-4'>
								{socials.map(social => {
									const Icon = socialIcons[social.platform] ?? ArrowUpRight
									return (
										<li key={social.id}>
											<a
												href={social.url}
												target='_blank'
												rel='noreferrer noopener'
												className='group flex items-center gap-3.5 py-3.5 transition-colors'>
												<span className='border-border bg-background text-muted-foreground group-hover:border-signal group-hover:text-signal-ink grid size-8 shrink-0 place-items-center rounded-lg border transition-all duration-300'>
													<Icon className='size-3.5' />
												</span>
												<span className='min-w-0 flex-1'>
													<span className='text-eyebrow block text-[0.625rem]'>{social.label}</span>
													<span className='text-foreground/90 block truncate font-mono text-xs'>
														{social.handle ?? social.url}
													</span>
												</span>
												<ArrowUpRight className='text-muted-foreground group-hover:text-foreground size-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
											</a>
										</li>
									)
								})}
							</ul>
						</div>
					</div>

					<div className='lg:col-span-7'>
						<Reveal delay={80} from='right'>
							{sent && submissionReceipt ? (
								<div className='panel flex flex-col items-center justify-center space-y-6 rounded-2xl p-8 text-center sm:p-12'>
									<div className='relative'>
										<div className='bg-success/15 border-success/30 grid size-16 place-items-center rounded-2xl border'>
											<CheckCircle2 className='text-success size-9' aria-hidden />
										</div>
										<Sparkles className='text-signal-ink absolute -top-1 -right-1 size-5 animate-pulse' />
									</div>

									<div className='space-y-2'>
										<h2 className='font-display text-foreground text-2xl font-semibold tracking-tight sm:text-3xl'>
											Message Dispatched!
										</h2>
										<p className='text-muted-foreground max-w-md text-sm leading-relaxed'>
											Thank you,{' '}
											<strong className='text-foreground'>{submissionReceipt.name}</strong>. Your
											inquiry has been registered in the database inbox.
										</p>
									</div>

									<div className='border-border bg-surface/60 w-full max-w-md space-y-2.5 rounded-xl border p-4 text-left font-mono text-xs'>
										<div className='border-border flex items-center justify-between border-b pb-2'>
											<span className='text-muted-foreground text-[0.625rem] uppercase'>
												Reference
											</span>
											<span className='text-signal-ink font-semibold'>{submissionReceipt.id}</span>
										</div>
										<div className='border-border flex items-center justify-between border-b pb-2'>
											<span className='text-muted-foreground text-[0.625rem] uppercase'>Time</span>
											<span className='text-foreground'>{submissionReceipt.timestamp}</span>
										</div>
										<div className='border-border flex items-center justify-between border-b pb-2'>
											<span className='text-muted-foreground text-[0.625rem] uppercase'>
												Sender
											</span>
											<span className='text-foreground max-w-50 truncate'>
												{submissionReceipt.email}
											</span>
										</div>
										<div className='flex items-center justify-between'>
											<span className='text-muted-foreground text-[0.625rem] uppercase'>
												Subject
											</span>
											<span className='text-foreground max-w-50 truncate'>
												{submissionReceipt.subject}
											</span>
										</div>
									</div>

									<div className='flex flex-wrap items-center justify-center gap-3 pt-2'>
										<Button variant='outline' onClick={handleResetForm}>
											Send another message
										</Button>
										<Button asChild variant='default'>
											<Link href='/projects'>Explore Selected Projects</Link>
										</Button>
									</div>
								</div>
							) : (
								<form
									onSubmit={handleSubmit}
									noValidate
									className='panel space-y-7 rounded-2xl p-7 sm:p-10'
									aria-label='Contact form'>
									<div className='flex items-center justify-between gap-4'>
										<div className='flex items-center gap-2'>
											<Zap className='text-signal-ink size-4' />
											<span className='text-eyebrow text-foreground font-semibold whitespace-nowrap'>
												Transmit Inquiry
											</span>
										</div>
										<span className='text-muted-foreground font-mono text-[0.625rem] uppercase'>
											API · PostgreSQL Connected
										</span>
									</div>

									{submitError ? (
										<div className='border-destructive/50 bg-destructive/10 space-y-3 rounded-xl border p-4 text-left'>
											<div className='text-destructive flex items-start gap-2.5 text-sm'>
												<span className='font-semibold'>Delivery notice:</span>
												<span>{submitError}</span>
											</div>

											<div className='border-destructive/20 flex flex-wrap items-center gap-2 border-t pt-1'>
												<a
													href={`mailto:${OFFICIAL_EMAIL}?subject=${encodeURIComponent(
														subject || 'Portfolio Inquiry',
													)}&body=${encodeURIComponent(
														`Hi Koushik,\n\n${message}\n\nBest regards,\n${name}\n${email}`,
													)}`}
													className='border-destructive/30 bg-destructive/20 text-destructive hover:bg-destructive/30 inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors'>
													<Mail className='size-3.5' />
													<span>Open in Email Client (Prefilled)</span>
												</a>
												<button
													type='button'
													onClick={handleCopyDraft}
													className='border-border bg-surface text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors'>
													{copiedDraft ? (
														<>
															<Check className='text-success size-3.5' />
															<span>Draft Copied!</span>
														</>
													) : (
														<>
															<Copy className='size-3.5' />
															<span>Copy Draft Text</span>
														</>
													)}
												</button>
											</div>
										</div>
									) : null}

									<div className='hidden' aria-hidden>
										<label htmlFor='company'>Company (leave blank)</label>
										<input id='company' name='company' tabIndex={-1} autoComplete='off' />
									</div>

									<div className='space-y-2.5'>
										<Label className='text-eyebrow'>What would you like to discuss?</Label>
										<div className='flex flex-wrap gap-2'>
											{TOPIC_PRESETS.map(topic => {
												const isSelected = selectedTopic === topic.id
												return (
													<button
														key={topic.id}
														type='button'
														onClick={() => handleSelectTopic(topic)}
														className={classNames(
															'inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-2 font-mono text-xs transition-all duration-200',
															isSelected
																? 'border-signal bg-signal/15 text-signal-ink font-semibold shadow-sm'
																: 'border-border bg-surface/50 text-muted-foreground hover:border-border-strong hover:bg-surface hover:text-foreground',
														)}>
														<span>{topic.icon}</span>
														<span>{topic.label}</span>
													</button>
												)
											})}
										</div>
									</div>

									<div className='grid gap-6 sm:grid-cols-2'>
										<div className='space-y-2'>
											<Label htmlFor='name' className='text-eyebrow'>
												Your Name <span className='text-destructive'>*</span>
											</Label>
											<Input
												id='name'
												name='name'
												value={name}
												onChange={e => {
													setName(e.target.value)
													validateField('name', e.target.value)
												}}
												onBlur={() => {
													setTouched(prev => ({ ...prev, name: true }))
													validateField('name', name)
												}}
												placeholder='Koushik Puppala'
												autoComplete='name'
												required
												aria-invalid={Boolean(errors.name)}
												aria-describedby={errors.name ? 'name-error' : undefined}
												className={classNames(
													errors.name && 'border-destructive focus-visible:ring-destructive',
												)}
											/>
											{errors.name ? (
												<p id='name-error' className='text-destructive font-mono text-xs'>
													{errors.name}
												</p>
											) : null}
										</div>

										<div className='space-y-2'>
											<Label htmlFor='email' className='text-eyebrow'>
												Your Email <span className='text-destructive'>*</span>
											</Label>
											<Input
												id='email'
												name='email'
												type='email'
												value={email}
												onChange={e => {
													setEmail(e.target.value)
													validateField('email', e.target.value)
												}}
												onBlur={() => {
													setTouched(prev => ({ ...prev, email: true }))
													validateField('email', email)
												}}
												placeholder='name@company.com'
												autoComplete='email'
												required
												aria-invalid={Boolean(errors.email)}
												aria-describedby={errors.email ? 'email-error' : undefined}
												className={classNames(
													errors.email && 'border-destructive focus-visible:ring-destructive',
												)}
											/>
											{errors.email ? (
												<p id='email-error' className='text-destructive font-mono text-xs'>
													{errors.email}
												</p>
											) : null}
										</div>
									</div>

									<div className='space-y-2'>
										<div className='flex items-center justify-between'>
											<Label htmlFor='subject' className='text-eyebrow'>
												Subject / Inquiry Title
											</Label>
											<span className='text-muted-foreground font-mono text-[0.625rem]'>
												Optional (defaults to &ldquo;Portfolio Inquiry&rdquo;)
											</span>
										</div>
										<Input
											id='subject'
											name='subject'
											value={subject}
											onChange={e => setSubject(e.target.value)}
											placeholder='e.g. Full-Stack Web App Build or Engineering Consultation'
											maxLength={200}
										/>
									</div>

									<div className='space-y-2'>
										<div className='flex items-center justify-between'>
											<Label htmlFor='message' className='text-eyebrow'>
												Message &amp; Context <span className='text-destructive'>*</span>
											</Label>
											<span
												className={classNames(
													'font-mono text-[0.6875rem] transition-colors',
													hasMinChars ? 'text-success font-medium' : 'text-muted-foreground',
												)}>
												{hasMinChars ? (
													<span className='inline-flex items-center gap-1'>
														<Check className='text-success size-3' />
														{charCount} chars (ready)
													</span>
												) : (
													<span>
														{charCount} / {minChars} min characters
													</span>
												)}
											</span>
										</div>
										<Textarea
											id='message'
											name='message'
											value={message}
											onChange={e => {
												setMessage(e.target.value)
												validateField('message', e.target.value)
											}}
											onBlur={() => {
												setTouched(prev => ({ ...prev, message: true }))
												validateField('message', message)
											}}
											rows={7}
											placeholder={
												selectedTopic
													? TOPIC_PRESETS.find(t => t.id === selectedTopic)?.placeholder
													: 'Share details regarding the opportunity, scope, challenges, or goals…'
											}
											required
											aria-invalid={Boolean(errors.message)}
											aria-describedby={errors.message ? 'message-error' : undefined}
											className={classNames(
												'min-h-35 resize-y',
												errors.message && 'border-destructive focus-visible:ring-destructive',
											)}
										/>
										{errors.message ? (
											<p id='message-error' className='text-destructive font-mono text-xs'>
												{errors.message}
											</p>
										) : null}
									</div>

									<div className='space-y-3 pt-2'>
										<Button
											type='submit'
											size='lg'
											variant='signal'
											className='h-12 w-full cursor-pointer text-sm font-semibold tracking-wide'
											disabled={loading}>
											{loading ? (
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

										<div className='text-muted-foreground flex items-center justify-between px-1 font-mono text-[0.6875rem]'>
											<span>Press Enter or click to submit</span>
											<span>Encrypted · Spam-Protected</span>
										</div>
									</div>
								</form>
							)}
						</Reveal>
					</div>
				</div>
			</Section>
		</SiteShell>
	)
}
