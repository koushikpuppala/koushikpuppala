import Logo from 'assets/images/logo.png'
import { classNames } from 'utils/classNames'
import Image, { type ImageProps } from 'next/image'

export const LogoGlyph = ({ className, alt = '', ...props }: Partial<ImageProps>) => {
	return (
		<Image
			{...props}
			alt={alt}
			src={Logo}
			loading='lazy'
			decoding='async'
			draggable={false}
			aria-hidden={!alt}
			className={classNames('object-contain select-none', className)}
		/>
	)
}

export const LogoMark = ({
	className,
	glyphClassName,
}: {
	className?: string
	glyphClassName?: string
}) => {
	return (
		<span
			className={classNames(
				'relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-[0.7rem] bg-white dark:bg-white',
				className,
			)}>
			<LogoGlyph className={classNames('relative size-full', glyphClassName)} loading='eager' />
		</span>
	)
}

export const LogoLockup = ({
	className,
	showText = true,
}: {
	className?: string
	showText?: boolean
}) => {
	return (
		<span className={classNames('flex items-center gap-2.5', className)}>
			<LogoMark className='transition-transform duration-500 ease-(--ease-out-expo) group-hover:scale-105' />
			{showText ? (
				<span className='hidden flex-col leading-none sm:flex'>
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
