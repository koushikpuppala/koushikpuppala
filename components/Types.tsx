'use client'

import Typed, { TypedOptions } from 'typed.js'
import { useEffect, useRef } from 'react'

const TypesComponent = () => {
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

	return <span ref={typedRef}></span>
}

export default TypesComponent
