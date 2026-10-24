import type { CreateUserPayload } from 'types/api'
import { z } from 'zod'

// Zod otherwise probes for eval on first parse, which the content security policy blocks and reports.
z.config({ jitless: true })

export const createUserSchema = z.object({
	fullName: z.string().min(2, 'Full name is required'),
	email: z.email('Valid email is required'),
	password: z.string().min(12, 'Password must be at least 12 characters'),
	role: z.enum(['ADMIN', 'EDITOR', 'USER']),
	status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
}) satisfies z.ZodType<CreateUserPayload>
