import type { NextComponentType } from 'next'
import Image from 'next/image'
import { useEffect } from 'react'
import { PortfolioAction } from '@import/actions'
import { PortfolioData } from '@import/data'

const Portfolio: NextComponentType = () => {
	useEffect(() => {
		PortfolioAction()
	}, [])

	return (
		<>
			<section
				id='portfolio'
				className='portfolio'>
				<div className='container'>
					<div className='section-title'>
						<h2>Portfolio</h2>
						<p>My Works</p>
					</div>

					<div className='row'>
						<div className='col-lg-12 d-flex justify-content-center'>
							<ul id='portfolio-filters'>
								<li
									data-filter='*'
									className='filter-active'>
									All
								</li>
								<li data-filter='.filter-web'>Web</li>
								<li data-filter='.filter-bot'>Bots</li>
								<li data-filter='.filter-app'>App</li>
								<li data-filter='.filter-open'>Open Source</li>
							</ul>
						</div>
					</div>

					<div className='row portfolio-container'>
						{PortfolioData.map((data, index) => {
							return (
								<div
									key={data.id}
									className={`col-lg-4 col-md-6 portfolio-item ${data.filter}`}>
									<div className='portfolio-wrap'>
										<Image
											src={data.image.main}
											className='img-fluid'
											alt={data.title}
										/>
										<div className='portfolio-info'>
											<h4>{data.title}</h4>
											<p>{data.subTitle}</p>
											<div className='portfolio-links'>
												<a
													href={data.image.main.src}
													data-gallery='portfolioGallery'
													className='portfolio-lightbox'
													title={`${data.title} - ${data.subTitle}`}>
													<i className='bx bx-plus'></i>
												</a>
												<a
													href={data.url}
													target='_blank'
													rel='noreferrer'>
													<i className='bx bx-link'></i>
												</a>
											</div>
										</div>
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</section>
		</>
	)
}

export default Portfolio
