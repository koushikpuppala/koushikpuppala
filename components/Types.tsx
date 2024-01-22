'use client'

import Typed, { TypedOptions } from 'typed.js'
import { useLayoutEffect, useRef } from 'react'

const TypesComponent = ({ once = false }) => {
	const typedRef = useRef(null)

	useLayoutEffect(() => {
		const options: TypedOptions = {
			strings: once
				? ["world a better place, and I'm committed to using my skills to make that happen."]
				: ['Problem solver', 'Code Creator', 'Web Enthusiast', 'Freelancer'],
			loop: !once,
			backSpeed: 25,
			backDelay: 2000,
			showCursor: false,
			loopCount: Infinity,
			typeSpeed: once ? 20 : 50,
		}
		const typed = new Typed(typedRef.current, options)
		return () => {
			typed.destroy()
		}
	}, [])

	return <span ref={typedRef}></span>
}

export default TypesComponent
