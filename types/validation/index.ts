import { z } from 'zod'
import { ContactFormSchema } from '@import/validation'

export type ContactFormType = z.infer<typeof ContactFormSchema>
