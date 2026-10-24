import type { Education } from 'types/models'

import { DTO_FIELDS } from 'types/api'
import { createCollectionActions } from 'actions/collection'

export const educationActions = createCollectionActions<Education>(
	'/api/v1/education',
	DTO_FIELDS.education,
)
