import React from 'react'
import Card from '../components/Card'
import { Portfolio } from '../data/Portfolio'
export default class Home extends React.Component {
	render() {
		return (
			<div
				style={{
					top: '50%',
					left: '50%',
					width: '30em',
					height: '18em',
					marginTop: '-9em',
					marginLeft: '-15em',
					position: 'fixed',
				}}>
				{Portfolio.map((list) => {
					return <Card {...list} />
				})}
			</div>
		)
	}
}
