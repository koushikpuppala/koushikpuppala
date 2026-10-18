import type { AboutContent } from 'types/models'

import { createSingletonActions } from './singleton'

export const aboutActions = createSingletonActions<AboutContent>('/api/v1/about')
