import { cn } from '@/lib/utils'

export const LOGO_SRC = '/images/brand/koushikpuppala-logo.png'

/**
 * Brand mark — the signature Koushik Puppala architectural monogram.
 */
export function LogoGlyph({
	className,
	alt = '',
	...props
}: React.ImgHTMLAttributes<HTMLImageElement> & { strokeWidth?: number }) {
	const { strokeWidth: _strokeWidth, ...rest } = props as { strokeWidth?: number }
	void _strokeWidth

	return (
		<img
			src={LOGO_SRC}
			alt={alt}
			aria-hidden={!alt}
			loading='lazy'
			decoding='async'
			draggable={false}
			className={cn('object-contain select-none', className)}
			{...(rest as React.ImgHTMLAttributes<HTMLImageElement>)}
		/>
	)
}

/** Chip-enclosed mark used in the header, footer and mobile menu. */
export function LogoMark({
	className,
	glyphClassName,
}: {
	className?: string
	glyphClassName?: string
}) {
	return (
		<span
			className={cn(
				'relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-[0.7rem] bg-white dark:bg-white',
				className,
			)}>
			<LogoGlyph className={cn('relative size-full', glyphClassName)} loading='eager' />
		</span>
	)
}

/** Full lockup: mark + name + role. */
export function LogoLockup({
	className,
	showText = true,
}: {
	className?: string
	showText?: boolean
}) {
	return (
		<span className={cn('flex items-center gap-2.5', className)}>
			<LogoMark className='transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-105' />
			{showText ? (
				<span className='hidden flex-col leading-none sm:flex'>
					<span className='font-display text-[0.9375rem] font-semibold tracking-tight text-foreground'>
						Koushik Puppala
					</span>
					<span className='mt-1 font-mono text-[0.625rem] tracking-[0.14em] text-muted-foreground uppercase'>
						Full Stack Engineer
					</span>
				</span>
			) : null}
		</span>
	)
}
