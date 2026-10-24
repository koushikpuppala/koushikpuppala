import { SetMetadata } from '@nestjs/common'

export const REVALIDATE_TAGS_KEY = 'revalidate:tags'

export const RevalidateTags = (...tags: string[]) => SetMetadata(REVALIDATE_TAGS_KEY, tags)
