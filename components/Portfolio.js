import React from 'react'
import Card from './Card'
import { PortfolioData } from '../data/Portfolio'

export default class Portfolio extends React.Component {
	render() {
		return (
			<>
				<section id='portfolio' className='portfolio section-bg'>
					<div className='container'>
						<div className='section-title'>
							<h2 data-aos='fade-right'>Portfolio</h2>
							<h3
								data-aos='fade-left'
								style={{
									fontFamily: 'Playfair Display, serif',
								}}>
								These are my all Projects which I made and collaborated and I am
								working on some more projects.
							</h3>
						</div>

						<div className='row portfolio-container portfolio-wrap'>
							{PortfolioData.map((data) => {
								return <Card {...data} key={data.id} />
							})}
						</div>
						<div
							data-aos='fade-up'
							style={{
								justifyContent: 'center !important',
								textAlign: 'center',
								alignItems: 'center',
								marginLeft: '-8.5rem',
								marginBottom: '2rem',
							}}>
							<button
								onClick={() => {
									window.location.href = '/projects'
								}}
								className='portfolio-button'>
								MORE PROJECTS
							</button>
						</div>
					</div>
				</section>
			</>
		)
	}
}
