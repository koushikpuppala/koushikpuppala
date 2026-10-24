import type { PageContainerProps } from 'types/components'
import { classNames } from 'utils/classNames'

export const PageContainer = ({
	children,
	className,
	as: Component = 'div',
	noPadding = false,
	...props
}: PageContainerProps) => {
	return (
		<Component
			className={classNames(
				'mx-auto w-full max-w-[1440px]',
				!noPadding && 'px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16',
				className,
			)}
			{...props}>
			{children}
		</Component>
	)
}
