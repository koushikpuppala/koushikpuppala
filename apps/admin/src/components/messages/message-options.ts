import type { DataTableFilters, SelectOption } from 'types/components'
import type { ContactPriority, ContactStatus } from 'types/enums'
import type { BadgeStyle } from 'types/components/admin'

export const STATUS_STYLES: Record<ContactStatus, BadgeStyle> = {
	UNREAD: { variant: 'signal', label: 'Unread' },
	READ: { variant: 'secondary', label: 'Read' },
	RESOLVED: { variant: 'success', label: 'Resolved' },
	ARCHIVED: { variant: 'outline', label: 'Archived' },
	SPAM: { variant: 'destructive', label: 'Spam' },
}

export const PRIORITY_STYLES: Record<ContactPriority, BadgeStyle> = {
	LOW: { variant: 'outline', label: 'Low' },
	NORMAL: { variant: 'secondary', label: 'Normal' },
	HIGH: { variant: 'warning', label: 'High' },
	URGENT: { variant: 'destructive', label: 'Urgent' },
}

const asOptions = <V extends string>(styles: Record<V, BadgeStyle>): SelectOption<V>[] =>
	(Object.keys(styles) as V[]).map(value => ({ label: value, value }))

export const STATUS_OPTIONS = asOptions(STATUS_STYLES)

export const PRIORITY_OPTIONS = asOptions(PRIORITY_STYLES)

export const MESSAGE_FILTERS: DataTableFilters[] = [
	{
		id: 'status',
		label: 'Status',
		type: 'select',
		options: [
			{ label: 'All Statuses', value: '' },
			...STATUS_OPTIONS.map(({ value }) => ({ label: STATUS_STYLES[value].label, value })),
		],
	},
	{
		id: 'priority',
		label: 'Priority',
		type: 'select',
		options: [
			{ label: 'All Priorities', value: '' },
			...PRIORITY_OPTIONS.map(({ value }) => ({ label: PRIORITY_STYLES[value].label, value })),
		],
	},
]
