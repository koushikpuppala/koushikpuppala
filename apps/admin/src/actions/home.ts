import type { HomeContent } from 'types/models'

import { createSingletonActions } from './singleton'

export const homeActions = createSingletonActions<HomeContent>('/api/v1/home')
