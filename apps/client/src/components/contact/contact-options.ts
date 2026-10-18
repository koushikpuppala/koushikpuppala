import type { ContactFormFields } from 'types/api'
import type { TopicOption } from 'types/components/client'
import { z } from 'zod'

export const DEFAULT_SUBJECT = 'Portfolio Inquiry'

export const MIN_MESSAGE = 20

export const RECAPTCHA_ACTION = 'contact_form_submit'

export const FIELD = 'h-11 px-3.5 text-base md:text-[0.9375rem]'

export const EMPTY_VALUES: ContactFormFields = { name: '', email: '', subject: '', message: '' }

export const contactSchema = z.object({
	name: z.string().min(2, 'Please enter your name (at least 2 characters).'),
	email: z.email('Please enter a valid email address (e.g. you@domain.com).'),
	subject: z.string().min(3, 'Subject must be at least 3 characters.').max(200),
	message: z
		.string()
		.min(MIN_MESSAGE, 'Please provide at least 20 characters for meaningful context.'),
}) satisfies z.ZodType<ContactFormFields>

export const TOPIC_PRESETS: TopicOption[] = [
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
