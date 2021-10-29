/** @format */

import React from 'react'
import '../Stylesheets/Footer.css'
import { FooterAction } from '../Actions/Footer'

class Footer extends React.Component {
	constructor() {
		super()
		this.state = {
			year: new Date().getFullYear(),
		}
	}
	componentDidMount() {
		FooterAction()
	}
	shouldComponentUpdate() {
		return false
	}
	render() {
		return (
			<div>
				<footer id='footer'>
					<div className='container'>
						<div className='copyright'>
							&copy; Copyright {this.state.year}
							<strong>
								<span>
									<a
										target='_blank'
										rel='noopener noreferrer'
										href='https://github.com/koushikpuppala'>
										Koushikpuppala
									</a>
								</span>
							</strong>
						</div>
						{/* <div className='credits'>Designed by @me</div> */}
					</div>
				</footer>

				<a
					href='#hero'
					className='back-to-top d-flex align-items-center justify-content-center scrollto'>
					<i className='bx bx-chevrons-up bx-flashing'>
						<span
							style={{
								display: 'none',
							}}>
							Go to Top
						</span>
					</i>
				</a>
			</div>
		)
	}
}

export default Footer
