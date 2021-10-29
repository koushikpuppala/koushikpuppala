/** @format */

import React from 'react'
import '../Stylesheets/Footer.css'
import { FooterAction } from '../Actions/Footer'

class Footer extends React.Component {
	constructor() {
		super()
		this.state = {
			year: new Date().getFullYear(),
			month: new Date().getMonth(),
			monthNames: [
				'January',
				'February',
				'March',
				'April',
				'May',
				'June',
				'July',
				'August',
				'September',
				'October',
				'November',
				'December',
			],
			date: new Date().getDate(),
		}
	}
	componentDidMount() {
		FooterAction()
	}
	shouldComponentUpdate() {
		return false
	}
	render() {
		const Today =
			this.state.date + ' ' + this.state.monthNames[this.state.month] + ' ' + this.state.year
		return (
			<div>
				<footer id='footer'>
					<div className='container'>
						<div className='copyright'>
							&copy; Copyright {Today}
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
