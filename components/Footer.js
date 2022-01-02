import React from 'react'
import { FooterAction } from '../actions/Footer'

export default class Footer extends React.Component {
	constructor() {
		super()
		this.state = {
			year: new Date().getFullYear(),
		}
	}
	componentDidMount() {
		FooterAction()
	}
	render() {
		return (
			<div>
				<footer id='footer'>
					<div className='container'>
						<div className='copyright'>&copy; Copyright {this.state.year}</div>
						<div className='credits'>
							Designed by{' '}
							<strong>
								<span>
									<a
										target='_blank'
										rel='noopener noreferrer'
										href='https://discord.koushikpuppala.live'>
										@me
									</a>
								</span>
							</strong>
						</div>
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
