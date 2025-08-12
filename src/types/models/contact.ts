import { z } from 'zod'
import { Document } from 'mongoose'
import { ContactFormValidation } from 'validation/contact'

export type ContactFormType = z.infer<typeof ContactFormValidation>

export type ContactModalProps = Document<string> & ContactFormType
