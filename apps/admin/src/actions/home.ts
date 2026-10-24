import type { HomeContent } from 'types/models'

import { createSingletonActions } from 'actions/singleton'

export const homeActions = createSingletonActions<HomeContent>('/api/v1/home')
