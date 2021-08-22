/** @format */

import React from 'react'
import { NotFoundAction } from '../Actions/NotFound'
import { Helmet } from 'react-helmet'
import { HomeTwoTone } from '@material-ui/icons'
import { Button } from '@material-ui/core'
import '../Stylesheets/NotFound.css'

class NotFound extends React.Component {
	componentDidMount() {
		NotFoundAction()
	}
	render() {
		return (
			<div>
				<Helmet>
					<title>Koushik Puppala | Page Not Found</title>
				</Helmet>
				<div className='NotFound'>
					<canvas id='c'></canvas>

					<div class='contentNotFound'>
						<h1 className='h1'>
							4<span class='black-hole'>0</span>4
						</h1>
						<h2 className='h2'>Page not found.</h2>
						<br />
						<Button
							variant='outlined'
							color='secondary'
							href='/'
							startIcon={<HomeTwoTone />}>
							Go to Home Page
						</Button>
					</div>

					<svg height='0'>
						<filter id='drop-shadow'>
							<feMorphology
								operator='dilate'
								radius='10'
								in='SourceAlpha'
								result='dilated'
							/>

							<feGaussianBlur stdDeviation='10' in='dilated' result='blurred' />

							<feMerge>
								<feMergeNode />
								<feMergeNode in='SourceGraphic' />
							</feMerge>
						</filter>
					</svg>
				</div>
			</div>
		)
	}
}

export default NotFound
