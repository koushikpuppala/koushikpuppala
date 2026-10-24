import type { ResumeRecord } from 'types/models'

import { DTO_FIELDS } from 'types/api'
import { createSingletonActions } from './singleton'

export const resumeActions = createSingletonActions<ResumeRecord>(
	'/api/v1/resume',
	DTO_FIELDS.resume,
)
