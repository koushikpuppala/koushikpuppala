import type { Project } from 'types/models'

import { DTO_FIELDS } from 'types/api'
import { createCollectionActions } from 'actions/collection'

export const projectsActions = createCollectionActions<Project>(
	'/api/v1/projects',
	DTO_FIELDS.project,
)
