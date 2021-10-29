/** @format */

import React from 'react'
import Typed from 'typed.js'

class Type extends React.Component {
	componentDidMount() {
		const options = {
			strings: [
				'Student',
				'Learner',
				'Programmer',
				'Web Developer',
				'Web Designer',
				'Freelancer',
			],
			typeSpeed: 50,
			backSpeed: 50,
			loop: true,
			cursorChar: '|',
		}
		// this.el refers to the <span> in the render() method
		this.typed = new Typed(this.el, options)
	}
	componentWillUnmount() {
		// Please don't forget to cleanup animation layer
		this.typed.destroy()
	}
	shouldComponentUpdate() {
		return false
	}
	render() {
		return (
			<div>
				<section
					id='hero'
					className='d-flex flex-column justify-content-center align-items-center'>
					<div className='hero-container' data-aos='fade-in'>
						<h1>Koushik Puppala</h1>
						<p>
							I'm&nbsp;
							<span
								ref={(el) => {
									this.el = el
								}}
								className='typed'></span>
						</p>
					</div>
				</section>
			</div>
		)
	}
}

export default Type
