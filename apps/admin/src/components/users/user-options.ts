import type { SelectOption } from 'types/components'
import type { UserRole, UserStatus } from 'types/enums'

export const ROLE_OPTIONS: SelectOption<UserRole>[] = [
	{ label: 'ADMIN', value: 'ADMIN' },
	{ label: 'EDITOR', value: 'EDITOR' },
	{ label: 'USER', value: 'USER' },
]

export const STATUS_OPTIONS: SelectOption<UserStatus>[] = [
	{ label: 'ACTIVE', value: 'ACTIVE' },
	{ label: 'INACTIVE', value: 'INACTIVE' },
	{ label: 'SUSPENDED', value: 'SUSPENDED' },
]

export const ROLE_DETAIL_OPTIONS: SelectOption<UserRole>[] = [
	{ label: 'ADMIN — Full destructive & administrative authority', value: 'ADMIN' },
	{ label: 'EDITOR — Content authoring and media publishing', value: 'EDITOR' },
	{ label: 'USER — Read-only authenticated profile', value: 'USER' },
]

export const STATUS_DETAIL_OPTIONS: SelectOption<UserStatus>[] = [
	{ label: 'ACTIVE — Normal operational state', value: 'ACTIVE' },
	{ label: 'INACTIVE — Temporary suspension', value: 'INACTIVE' },
	{ label: 'SUSPENDED — Locked account', value: 'SUSPENDED' },
]
