'use client'

import classNames from 'classnames'
import React, { createContext, useState, useRef, useEffect, use } from 'react'
import { CardBodyProps, CardContainerProps, CardItemProps } from '@import/types'

const MouseEnterContext = createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined>(undefined)

export const CardContainer = ({ children, className, containerClassName, options }: CardContainerProps) => {
	const max = options?.max ?? 35
	const scale = options?.scale ?? 1.1
	const speed = options?.speed ?? 1000

	const containerRef = useRef<HTMLDivElement>(null)
	const [isMouseEntered, setIsMouseEntered] = useState(false)

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!containerRef.current) return
		const { left, top, width, height } = containerRef.current.getBoundingClientRect()
		const x = Math.min(Math.max((e.nativeEvent.clientX - left) / width, 0), 1)
		const y = Math.min(Math.max((e.nativeEvent.clientY - top) / height, 0), 1)
		const tiltX = (max / 2 - x * max).toFixed(2)
		const tiltY = (y * max - max / 2).toFixed(2)
		containerRef.current.style.transform = `rotateY(${tiltX}deg) rotateX(${tiltY}deg)`
	}

	const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault()
		setIsMouseEntered(true)
		if (!containerRef.current) return
	}

	const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault()
		if (!containerRef.current) return
		setIsMouseEntered(false)
		containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`
	}
	return (
		<MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
			<div
				className={classNames('flex items-center justify-center', containerClassName)}
				style={{
					perspective: `${1e3}px`,
					scale: scale,
					transition: `${speed}ms cubic-bezier(.03,.98,.52,.99)`,
				}}>
				<div
					ref={containerRef}
					onMouseEnter={handleMouseEnter}
					onMouseMove={handleMouseMove}
					onMouseLeave={handleMouseLeave}
					className={classNames(
						'relative flex items-center justify-center transition-all duration-200 ease-linear',
						className,
					)}
					style={{ transformStyle: 'preserve-3d' }}>
					{children}
				</div>
			</div>
		</MouseEnterContext.Provider>
	)
}

export const CardBody = ({ children, className, ...rest }: CardBodyProps) => {
	return (
		<div
			{...rest}
			className={classNames(
				'h-auto w-auto [transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]',
				className,
			)}>
			{children}
		</div>
	)
}

export const CardItem = ({
	as: Tag = 'div',
	children,
	className,
	translateX = 0,
	translateY = 0,
	translateZ = 0,
	rotateX = 0,
	rotateY = 0,
	rotateZ = 0,
	...rest
}: CardItemProps) => {
	const ref = useRef<HTMLDivElement>(null)
	const [isMouseEntered] = useMouseEnter()

	useEffect(() => {
		if (!ref.current) return
		if (isMouseEntered) {
			ref.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`
		} else {
			ref.current.style.transform = `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`
		}
	}, [isMouseEntered, translateX, translateY, translateZ, rotateX, rotateY, rotateZ])

	return (
		<Tag ref={ref} className={classNames('w-fit transition duration-200 ease-linear', className)} {...rest}>
			{children}
		</Tag>
	)
}

// Create a hook to use the context
export const useMouseEnter = () => {
	const context = use(MouseEnterContext)
	if (context === undefined) {
		throw new Error('useMouseEnter must be used within a MouseEnterProvider')
	}
	return context
}
