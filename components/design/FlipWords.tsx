'use client'

import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FlipWordsProps } from '@import/types'

export const FlipWords = ({ words, duration = 2500, className }: FlipWordsProps) => {
	const [currentWord, setCurrentWord] = useState(words[0])

	useEffect(() => {
		let i = 0
		const interval = setInterval(() => {
			i++
			if (i === words.length) i = 0
			const word = words[i]
			setCurrentWord(word)
		}, duration)

		return () => clearInterval(interval)
	}, [duration, words])

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 5, ease: 'easeInOut', type: 'spring', stiffness: 100, damping: 10 }}
				exit={{ opacity: 0, y: -40, x: 40, filter: 'blur(16px)', scale: 2, position: 'absolute' }}
				className={classNames('relative z-10 inline-block text-left', className)}>
				{currentWord.split('').map((letter, index) => (
					<motion.span
						key={currentWord + index}
						initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
						animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
						transition={{ delay: index * 0.05, duration: index * 0.075, ease: 'easeInOut' }}
						className='inline-block'>
						{letter === ' ' ? '\u00A0' : letter}
					</motion.span>
				))}
			</motion.div>
		</AnimatePresence>
	)
}
