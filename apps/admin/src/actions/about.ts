import type { AboutContent } from 'types/models'

import { createSingletonActions } from 'actions/singleton'

export const aboutActions = createSingletonActions<AboutContent>('/api/v1/about')
