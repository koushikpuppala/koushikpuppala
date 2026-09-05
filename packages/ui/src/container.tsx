import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import { classNames } from 'utils/classNames'

export interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode
	className?: string
	as?: ElementType
	noPadding?: boolean
}

/**
 * PageContainer
 * Wide editorial layout container reproducing the Lovable desktop canvas with generous responsive spacing.
 */
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

export interface ContentContainerProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode
	className?: string
	as?: ElementType
	size?: 'sm' | 'md' | 'lg' | 'xl'
}

/**
 * ContentContainer
 * Constrained readable width container for editorial copy, long-form content, and case studies.
 */
export const ContentContainer = ({
	children,
	className,
	as: Component = 'div',
	size = 'md',
	...props
}: ContentContainerProps) => {
	const sizeMap = {
		sm: 'max-w-2xl',
		md: 'max-w-3xl',
		lg: 'max-w-4xl',
		xl: 'max-w-5xl',
	}

	return (
		<Component className={classNames('mx-auto w-full', sizeMap[size], className)} {...props}>
			{children}
		</Component>
	)
}

export interface SectionContainerProps extends HTMLAttributes<HTMLElement> {
	children: ReactNode
	className?: string
	as?: ElementType
	spacing?: 'tight' | 'normal' | 'generous' | 'none'
}

/**
 * SectionContainer
 * Provides consistent vertical rhythm and section anchors across the portfolio.
 */
export const SectionContainer = ({
	children,
	className,
	as: Component = 'section',
	spacing = 'normal',
	...props
}: SectionContainerProps) => {
	const spacingMap = {
		tight: 'py-10 sm:py-14 md:py-16',
		normal: 'py-16 sm:py-20 md:py-28 lg:py-32',
		generous: 'py-20 sm:py-28 md:py-36 lg:py-44',
		none: 'py-0',
	}

	return (
		<Component
			className={classNames('relative w-full', spacingMap[spacing], className)}
			{...props}>
			{children}
		</Component>
	)
}
