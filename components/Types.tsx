'use client'

import Typed, { TypedOptions } from 'typed.js'
import { useLayoutEffect, useRef } from 'react'

const TypesComponent = ({ strings, loop }: { strings: string[]; loop: boolean }) => {
	const typedRef = useRef(null)

	useLayoutEffect(() => {
		const options: TypedOptions = {
			strings: strings,
			loop: loop,
			backSpeed: 25,
			backDelay: 2000,
			showCursor: false,
			loopCount: Infinity,
			typeSpeed: loop ? 50 : 20,
		}
		const typed = new Typed(typedRef.current, options)
		return () => {
			typed.destroy()
		}
	}, [strings, loop])

	return <span ref={typedRef}></span>
}

export default TypesComponent
