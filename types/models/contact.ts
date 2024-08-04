import { z } from 'zod'
import { Document } from 'mongoose'
import { ContactFormSchema } from '@import/validation'

export type ContactFormType = z.infer<typeof ContactFormSchema>

export type ContactModalProps = Document<string> & ContactFormType
