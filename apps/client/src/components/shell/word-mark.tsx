import type { WordMarkProps } from 'types/components/client'
import Link from 'next/link'
import { LogoLockup } from 'components/brand/logo'

export const WordMark = ({ compact = false }: WordMarkProps) => {
	return (
		<Link
			href='/'
			className='group flex items-center gap-2.5 outline-none'
			aria-label={compact ? 'Koushik Puppala — home' : undefined}>
			<LogoLockup showText={!compact} />
			{compact ? null : <span className='sr-only'>, home</span>}
		</Link>
	)
}
