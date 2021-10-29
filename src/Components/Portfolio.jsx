/** @format */

import React from 'react'
import { PortfolioActions } from '../Actions/Portfolio'
import { PortfolioData } from '../Data/Portfolio'
import '../Stylesheets/Portfolio.css'

class Portfolio extends React.Component {
	componentDidMount() {
		PortfolioActions()
	}
	shouldComponentUpdate() {
		return false
	}
	render() {
		return (
			<div>
				<section id='portfolio' className='portfolio section-bg'>
					<div className='container'>
						<div className='section-title'>
							<h2>Portfolio</h2>
							<p>
								These are my all Projects which I made and collaborated and i am
								working on some more projects.
							</p>
						</div>

						<div className='row' data-aos='fade-up'>
							<div className='col-lg-12 d-flex justify-content-center'>
								<ul id='portfolio-filters'>
									<li data-filter='*' className='filter-active'>
										All
									</li>
									<li data-filter='.filter-web'>Web</li>
									<li data-filter='.filter-card'>Bots</li>
									<li data-filter='.filter-app'>App</li>
								</ul>
							</div>
						</div>
						<div
							className='row portfolio-container'
							data-aos='fade-up'
							data-aos-delay='100'>
							{PortfolioData.map((e) => {
								return (
									<div className={e.Class} key={e.id}>
										<div
											className='portfolio-wrap'
											style={{
												backgroundImage: `url(${e.Image})`,
											}}>
											<div className='portfolio-content'>
												<h3 className='portfolio-item-title'>{e.Title}</h3>
												<p className='portfolio-item-description'>
													{e.Description}
												</p>
												<a
													className='portfolio-item-link'
													target='_blank'
													rel='noopener noreferrer'
													href={e.Link}>
													{e.LinkName}
												</a>
											</div>
										</div>
									</div>
								)
							})}
						</div>
					</div>
				</section>
			</div>
		)
	}
}

export default Portfolio
