import type { BadgeStyle, ValueBadgeProps } from 'types/components/admin'
import { Badge } from 'components/ui/badge'
import { PRIORITY_STYLES, STATUS_STYLES } from './message-options'

const styleOf = (styles: Record<string, BadgeStyle>, value: string): BadgeStyle =>
	styles[value] ?? { variant: 'outline', label: value }

export const StatusBadge = ({ value }: ValueBadgeProps) => {
	const { variant, label } = styleOf(STATUS_STYLES, value)

	return <Badge variant={variant}>{label}</Badge>
}

export const PriorityBadge = ({ value }: ValueBadgeProps) => {
	const { variant, label } = styleOf(PRIORITY_STYLES, value)

	return <Badge variant={variant}>{label}</Badge>
}
