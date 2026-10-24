import type { LogoMarkProps } from 'types/components'
import Image, { type ImageProps } from 'next/image'
import { classNames } from 'utils/classNames'
import Logo from './assets/logo.png'

export const LogoGlyph = ({
	className,
	alt = '',
	loading = 'lazy',
	...props
}: Partial<ImageProps>) => {
	return (
		<Image
			{...props}
			alt={alt}
			src={Logo}
			width={512}
			height={512}
			loading={loading}
			decoding='async'
			draggable={false}
			aria-hidden={!alt}
			className={classNames('object-contain select-none', className)}
		/>
	)
}

export const LogoMark = ({ className, glyphClassName }: LogoMarkProps) => {
	return (
		<span
			className={classNames(
				'relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-[0.7rem] bg-white',
				className,
			)}>
			<LogoGlyph className={classNames('relative size-full', glyphClassName)} loading='eager' />
		</span>
	)
}
