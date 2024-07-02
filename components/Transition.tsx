'use client'

import { TransitionComponentProps } from '@import/types'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

const transitionVariants = {
	initial: {
		x: '100%',
		width: '100%',
	},
	animate: {
		x: '0%',
		width: '0%',
	},
	exit: {
		x: ['100%', '0%'],
		width: ['100%', '0%'],
		display: 'none',
	},
}

const TransitionComponent = ({ children }: TransitionComponentProps) => {
	const pathname = usePathname()

	if (pathname.includes('/studio')) return children

	return (
		<AnimatePresence mode='sync'>
			<motion.div key={pathname} className='h-full'>
				<motion.div
					className='fixed bottom-0 right-full top-0 z-30 h-screen w-screen bg-[#2e2257]'
					variants={transitionVariants}
					initial='initial'
					animate='animate'
					exit='exit'
					transition={{
						delay: 0.2,
						duration: 0.6,
						ease: 'easeInOut',
					}}
				/>
				<motion.div
					className='fixed bottom-0 right-full top-0 z-20 h-screen w-screen bg-[#3b2d71]'
					variants={transitionVariants}
					initial='initial'
					animate='animate'
					exit='exit'
					transition={{
						delay: 0.4,
						duration: 0.6,
						ease: 'easeInOut',
					}}
				/>
				<motion.div
					className='fixed bottom-0 right-full top-0 z-10 h-screen w-screen bg-[#4b3792]'
					variants={transitionVariants}
					initial='initial'
					animate='animate'
					exit='exit'
					transition={{
						delay: 0.6,
						duration: 0.6,
						ease: 'easeInOut',
					}}
				/>
				{children}
			</motion.div>
		</AnimatePresence>
	)
}

export default TransitionComponent
