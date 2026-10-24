import type { AutoRefreshToggleProps } from 'types/components/admin'
import { classNames } from 'utils/classNames'

export const AutoRefreshToggle = ({ active, onToggle }: AutoRefreshToggleProps) => (
	<button
		type='button'
		onClick={onToggle}
		aria-pressed={active}
		className={classNames(
			'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
			active
				? 'border-signal-ink bg-signal-ink/10 text-signal-ink'
				: 'border-border bg-surface text-muted-foreground hover:text-foreground',
		)}>
		<span
			className={classNames(
				'h-2 w-2 rounded-full',
				active ? 'bg-signal-ink animate-ping' : 'bg-muted-foreground',
			)}
		/>
		{active ? 'Live Polling (10s)' : 'Auto-refresh Off'}
	</button>
)
