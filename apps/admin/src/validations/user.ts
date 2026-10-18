import type { CreateUserPayload } from 'types/api'
import { z } from 'zod'

export const createUserSchema = z.object({
	fullName: z.string().min(2, 'Full name is required'),
	email: z.email('Valid email is required'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
	role: z.enum(['ADMIN', 'EDITOR', 'USER']),
	status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
}) satisfies z.ZodType<CreateUserPayload>
