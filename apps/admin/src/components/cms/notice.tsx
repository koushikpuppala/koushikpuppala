import type { NoticeProps } from 'types/components/admin'
import { Sparkles } from 'components/icons'

export const Notice = ({ message }: NoticeProps) =>
	message ? (
		<div className='border-success/30 bg-success/10 text-success flex items-center gap-2 rounded-xl border p-3 font-mono text-xs'>
			<Sparkles className='size-3.5' />
			<span>{message}</span>
		</div>
	) : null
