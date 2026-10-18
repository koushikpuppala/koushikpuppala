import type { LogoLockupProps } from 'types/components/client'
import { LogoMark } from 'ui/logo'
import { classNames } from 'utils/classNames'

export { LogoGlyph } from 'ui/logo'

export const LogoLockup = ({ className, showText = true }: LogoLockupProps) => {
	return (
		<span className={classNames('flex items-center gap-2.5', className)}>
			<LogoMark className='transition-transform duration-500 ease-(--ease-out-expo) group-hover:scale-105' />
			{showText ? (
				<span className='sr-only flex-col leading-none sm:not-sr-only sm:flex'>
					<span className='font-display text-foreground text-[0.9375rem] font-semibold tracking-tight'>
						Koushik Puppala
					</span>
					<span className='text-muted-foreground mt-1 font-mono text-[0.625rem] tracking-[0.14em] uppercase'>
						Full Stack Engineer
					</span>
				</span>
			) : null}
		</span>
	)
}
