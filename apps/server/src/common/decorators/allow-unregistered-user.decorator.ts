import { SetMetadata } from '@nestjs/common'

export const ALLOW_UNREGISTERED_USER_KEY = 'allowUnregisteredUser'

export const AllowUnregisteredUser = () => SetMetadata(ALLOW_UNREGISTERED_USER_KEY, true)
