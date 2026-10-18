import type { Experience } from 'types/models'

import { DTO_FIELDS } from 'types/api'
import { createCollectionActions } from './collection'

export const experienceActions = createCollectionActions<Experience>(
	'/api/v1/experience',
	DTO_FIELDS.experience,
)
