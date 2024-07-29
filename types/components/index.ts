import { HTMLAttributes } from 'react'
import { ProjectSchemaProps, searchParamsProps } from '../'

export type FlipWordsComponentProps = {
	words: string[]
	duration?: number
	className?: string
}

export type TextGenerateEffectComponentProps = {
	strings: string[]
	className?: string
}

export type CardComponentProps = HTMLAttributes<HTMLElement> & {
	children?: React.ReactNode
	className?: string
}

export type CardContainerComponentProps = CardComponentProps & {
	containerClassName?: string
	options?: { max?: number; scale?: number; speed?: number }
}

export type CardBodyComponentProps = CardComponentProps

export type CardItemComponentProps = CardComponentProps & {
	as?: React.ElementType
	translateX?: number | string
	translateY?: number | string
	translateZ?: number | string
	rotateX?: number | string
	rotateY?: number | string
	rotateZ?: number | string
	[key: string]: any
}

export type ProjectCardComponentProps = searchParamsProps & {
	data: ProjectSchemaProps[]
}

export type BackgroundBeamsProps = {
	className?: string
}
