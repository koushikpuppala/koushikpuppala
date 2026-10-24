import type { Service } from 'types/models'

import { DTO_FIELDS } from 'types/api'
import { createCollectionActions } from './collection'

export const servicesActions = createCollectionActions<Service>(
	'/api/v1/services',
	DTO_FIELDS.service,
)
