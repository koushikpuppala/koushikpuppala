import { ContactFormSchema } from '@import/validation'
import { Document } from 'mongoose'
import { z } from 'zod'

export type ContactFormType = z.infer<typeof ContactFormSchema>

export type ContactModalProps = Document<string> & ContactFormType
