import { HTMLAttributes } from 'react'
import { ProjectSchema } from '../'

export type FlipWordsProps = {
	words: string[]
	duration?: number
	className?: string
}

export type TextGenerateEffectProps = {
	strings: string[]
	className?: string
}

export type CardProps = HTMLAttributes<HTMLElement> & {
	children?: React.ReactNode
	className?: string
}

export type CardContainerProps = CardProps & {
	containerClassName?: string
	options?: { max?: number; scale?: number; speed?: number }
}

export type CardBodyProps = CardProps

export type CardItemProps = CardProps & {
	as?: React.ElementType
	translateX?: number | string
	translateY?: number | string
	translateZ?: number | string
	rotateX?: number | string
	rotateY?: number | string
	rotateZ?: number | string
	[key: string]: any
}

export type ProjectCardProps = {
	data: ProjectSchema[]
	id: string | undefined
	tag: string
}

export type BackgroundBeamsProps = {
	className?: string
}
