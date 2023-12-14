'use client'

import Typed, { TypedOptions } from 'typed.js'
import { fadeIn } from '@import/actions'
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { SocialMedia } from '@import/constant'

const HomePage = () => {
	const typedRef = useRef(null)

	useEffect(() => {
		const options: TypedOptions = {
			strings: ['Problem solver', 'Code Creator', 'Web Enthusiast', 'Freelancer'],
			typeSpeed: 50,
			backSpeed: 25,
			loop: true,
			showCursor: false,
			backDelay: 2000,
			loopCount: Infinity,
		}
		const typed = new Typed(typedRef.current, options)
		return () => {
			typed.destroy()
		}
	}, [])

	return (
		<div className='h-full bg-primary/60'>
			<div className='h-full w-full bg-gradient-to-r from-primary/10 via-black/30 to-black/10'>
				<div className='container mx-auto flex h-full flex-col justify-center text-center lg:text-left'>
					<motion.h1
						variants={fadeIn('down', 0.2)}
						initial='hidden'
						animate='show'
						exit='hidden'
						className='h1 mb-4 text-accent'>
						Koushik Puppala <span className='font-light leading-relaxed text-white/60'>|</span>{' '}
						<span ref={typedRef}></span>
					</motion.h1>
					<motion.p
						variants={fadeIn('down', 0.3)}
						initial='hidden'
						animate='show'
						exit='hidden'
						className='mx-auto mb-2 max-w-sm lg:mx-0 lg:max-w-xl lg:text-justify'>
						Full-stack developer by day, dreamer by night. I believe that technology has the power to make
						the world a better place, and I'm committed to using my skills to make that happen.
						{/* I'm always thinking about the next big thing. */}
					</motion.p>
					<motion.div
						variants={fadeIn('down', 0.4)}
						initial='hidden'
						animate='show'
						exit='hidden'
						className='mt-2 flex justify-center lg:justify-normal'>
						{SocialMedia.map((item, index) => (
							<Link
								key={index}
								href={item.href}
								target='_blank'
								rel='noreferrer'
								className='mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 align-middle text-base leading-none no-underline hover:bg-accent/50'>
								<span className='sr-only'>{item.name}</span>
								<item.icon className='font-light leading-relaxed text-white' />
							</Link>
						))}
					</motion.div>
				</div>
			</div>
		</div>
	)
}

export default HomePage
