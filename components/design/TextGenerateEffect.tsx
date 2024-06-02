'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, stagger, useAnimate } from 'framer-motion'
import classNames from 'classnames'
import { TextGenerateEffectComponentProps } from '@import/types'

export const TextGenerateEffectComponent = ({ strings, className }: TextGenerateEffectComponentProps) => {
	const [scope, animate] = useAnimate()
	const [currentString, setCurrentString] = useState(strings[0])

	useEffect(() => {
		let i = 0
		const interval = setInterval(
			() => {
				i++
				if (i === strings.length) i = 0
				setCurrentString(strings[i])
			},
			Math.round(currentString.split(' ').length * 0.4 * 1000),
		)

		return () => clearInterval(interval)
	}, [currentString, strings])

	useEffect(() => {
		animate(
			'span',
			{ opacity: 1 },
			{
				duration: currentString.split(' ').length * 0.2,
				delay: stagger(0.2),
			},
		)
	}, [currentString, animate])

	return (
		<AnimatePresence>
			<motion.span
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{
					duration: 5,
					ease: 'easeInOut',
					type: 'spring',
					stiffness: 100,
					damping: 10,
				}}
				exit={{ opacity: 0, y: -40, x: 40, filter: 'blur(24px)', scale: 0.5, position: 'absolute' }}
				className={classNames('relative z-10 text-left', className)}
				ref={scope}>
				{currentString.split(' ').map((word, idx) => {
					return (
						<motion.span key={word + idx} className={classNames('opacity-0', className)}>
							{word}{' '}
						</motion.span>
					)
				})}
			</motion.span>
		</AnimatePresence>
	)

	// return {
	// 	words.map
	// 	<motion.span ref={scope}>
	// 		{wordsArray.map((word, idx) => {
	// 			return (
	// 				<motion.span key={word + idx} className={classNames('opacity-0', className)}>
	// 					{word}{' '}
	// 				</motion.span>
	// 			)
	// 		})}
	// 	</motion.span>
	// 	}
}
