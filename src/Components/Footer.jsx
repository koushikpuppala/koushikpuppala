/** @format */

import React from 'react'
import '../Stylesheets/Footer.css'
import { FooterAction } from '../Actions/Footer'

class Footer extends React.Component {
	componentDidMount() {
		FooterAction()
	}
	render() {
		return (
			<div>
				<footer id='footer'>
					<div className='container'>
						<div className='copyright'>
							&copy; Copyright{' '}
							<strong>
								<span>Koushikpuppala</span>
							</strong>
						</div>
						<div className='credits'>
							Designed by <a href='https://koushikpuppala.live/'>Koushikpuppala</a>
						</div>
					</div>
				</footer>

				<a
					href='#hero'
					className='back-to-top d-flex align-items-center justify-content-center scrollto'>
					<i className='bx bx-chevrons-up bx-flashing'></i>
				</a>
			</div>
		)
	}
}

export default Footer
