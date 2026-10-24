import type { ServiceTileProps, ServiceTileTone } from 'types/components/admin'
import { classNames } from 'utils/classNames'

const TONES: Record<ServiceTileTone, string> = {
	ok: 'bg-emerald-500/10 text-emerald-500',
	warn: 'bg-amber-500/10 text-amber-500',
	down: 'bg-red-500/10 text-red-500',
	info: 'bg-signal-ink/10 text-signal-ink',
}

export const ServiceTile = ({
	icon,
	label,
	value,
	detail,
	tone,
	valueClassName,
}: ServiceTileProps) => (
	<div className='border-border bg-surface flex items-center gap-4 rounded-2xl border p-5 shadow-xs'>
		<div className={classNames('flex size-11 items-center justify-center rounded-xl', TONES[tone])}>
			{icon}
		</div>
		<div>
			<p className='text-muted-foreground font-mono text-xs font-semibold tracking-wider uppercase'>
				{label}
			</p>
			<p className={classNames('text-foreground mt-0.5 text-lg font-bold', valueClassName)}>
				{value}
			</p>
			<p className='text-muted-foreground text-[11px]'>{detail}</p>
		</div>
	</div>
)
