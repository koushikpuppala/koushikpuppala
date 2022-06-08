import type { NextComponentType } from 'next'
import Image from 'next/image'
import { useEffect } from 'react'
import { PortfolioAction } from '../actions'

const Portfolio: NextComponentType = () => {
	useEffect(() => {
		PortfolioAction()
	}, [])

	return (
		<>
			<section id='portfolio' className='portfolio'>
				<div className='container'>
					<div className='section-title'>
						<h2>Portfolio</h2>
						<p>My Works</p>
					</div>

					<div className='row'>
						<div className='col-lg-12 d-flex justify-content-center'>
							<ul id='portfolio-flters'>
								<li data-filter='*' className='filter-active'>
									All
								</li>
								<li data-filter='.filter-web'>Web</li>
								<li data-filter='.filter-bot'>Bots</li>
								<li data-filter='.filter-app'>App</li>
							</ul>
						</div>
					</div>

					<div className='row portfolio-container'>
						<div className='col-lg-4 col-md-6 portfolio-item filter-web'>
							<div className='portfolio-wrap'>
								<Image
									width={1920}
									height={1080}
									layout='responsive'
									src='/img/portfolio/Koushikpuppala.webp'
									className='img-fluid'
									alt=''
								/>
								<div className='portfolio-info'>
									<h4>Koushikpuppala</h4>
									{/* <p>App</p> */}
									<div className='portfolio-links'>
										<a
											href='/img/portfolio/Koushikpuppala.webp'
											data-gallery='portfolioGallery'
											className='portfolio-lightbox'
											title='Koushikpuppala'>
											<i className='bx bx-plus'></i>
										</a>
										<a
											href='portfolio-details.html'
											data-gallery='portfolioDetailsGallery'
											data-glightbox='type: external'
											className='portfolio-details-lightbox'
											title='Koushikpuppala'>
											<i className='bx bx-link'></i>
										</a>
									</div>
								</div>
							</div>
						</div>

						<div className='col-lg-4 col-md-6 portfolio-item filter-web'>
							<div className='portfolio-wrap'>
								<Image
									width={1920}
									height={1080}
									layout='responsive'
									src='/img/portfolio/AvengersAssemble.webp'
									className='img-fluid'
									alt=''
								/>
								<div className='portfolio-info'>
									<h4>Avengers Assemble</h4>
									{/* <p>Web</p>  */}
									<div className='portfolio-links'>
										<a
											href='/img/portfolio/AvengersAssemble.webp'
											data-gallery='portfolioGallery'
											className='portfolio-lightbox'
											title='Avengers Assemble'>
											<i className='bx bx-plus'></i>
										</a>
										<a
											href='portfolio-details.html'
											data-gallery='portfolioDetailsGallery'
											data-glightbox='type: external'
											className='portfolio-details-lightbox'
											title='Avengers Assemble'>
											<i className='bx bx-link'></i>
										</a>
									</div>
								</div>
							</div>
						</div>

						<div className='col-lg-4 col-md-6 portfolio-item filter-web'>
							<div className='portfolio-wrap'>
								<Image
									width={1920}
									height={1080}
									layout='responsive'
									src='/img/portfolio/IIITR.webp'
									className='img-fluid'
									alt=''
								/>
								<div className='portfolio-info'>
									<h4>IIITR</h4>
									{/* <p>App</p> */}
									<div className='portfolio-links'>
										<a
											href='/img/portfolio/IIITR.webp'
											data-gallery='portfolioGallery'
											className='portfolio-lightbox'
											title='IIITR'>
											<i className='bx bx-plus'></i>
										</a>
										<a
											href='portfolio-details.html'
											data-gallery='portfolioDetailsGallery'
											data-glightbox='type: external'
											className='portfolio-details-lightbox'
											title='IIITR'>
											<i className='bx bx-link'></i>
										</a>
									</div>
								</div>
							</div>
						</div>

						<div className='col-lg-4 col-md-6 portfolio-item filter-web'>
							<div className='portfolio-wrap'>
								<Image
									width={1920}
									height={1080}
									src='/img/portfolio/StudentIIITR.webp'
									className='img-fluid'
									alt=''
								/>
								<div className='portfolio-info'>
									<h4>Students IIITR</h4>
									{/* <p>Card</p> */}
									<div className='portfolio-links'>
										<a
											href='/img/portfolio/StudentIIITR.webp'
											data-gallery='portfolioGallery'
											className='portfolio-lightbox'
											title='Students IIITR'>
											<i className='bx bx-plus'></i>
										</a>
										<a
											href='portfolio-details.html'
											data-gallery='portfolioDetailsGallery'
											data-glightbox='type: external'
											className='portfolio-details-lightbox'
											title='Students IIITR'>
											<i className='bx bx-link'></i>
										</a>
									</div>
								</div>
							</div>
						</div>

						<div className='col-lg-4 col-md-6 portfolio-item filter-web'>
							<div className='portfolio-wrap'>
								<Image
									width={1920}
									height={1080}
									src='/img/portfolio/Jai.webp'
									className='img-fluid'
									alt=''
								/>
								<div className='portfolio-info'>
									<h4>Jai Goyal</h4>
									{/* <p>Web</p> */}
									<div className='portfolio-links'>
										<a
											href='/img/portfolio/Jai.webp'
											data-gallery='portfolioGallery'
											className='portfolio-lightbox'
											title='Jai Goyal'>
											<i className='bx bx-plus'></i>
										</a>
										<a
											href='portfolio-details.html'
											data-gallery='portfolioDetailsGallery'
											data-glightbox='type: external'
											className='portfolio-details-lightbox'
											title='Jai Goyal'>
											<i className='bx bx-link'></i>
										</a>
									</div>
								</div>
							</div>
						</div>

						<div className='col-lg-4 col-md-6 portfolio-item filter-web'>
							<div className='portfolio-wrap'>
								<Image
									width={1920}
									height={1080}
									src='/img/portfolio/DiscordLists100.webp'
									className='img-fluid'
									alt=''
								/>
								<div className='portfolio-info'>
									<h4>Discord Lists 100</h4>
									{/* <p>App</p> */}
									<div className='portfolio-links'>
										<a
											href='/img/portfolio/DiscordLists100.webp'
											data-gallery='portfolioGallery'
											className='portfolio-lightbox'
											title='Discord Lists 100'>
											<i className='bx bx-plus'></i>
										</a>
										<a
											href='portfolio-details.html'
											data-gallery='portfolioDetailsGallery'
											data-glightbox='type: external'
											className='portfolio-details-lightbox'
											title='Discord Lists 100'>
											<i className='bx bx-link'></i>
										</a>
									</div>
								</div>
							</div>
						</div>

						<div className='col-lg-4 col-md-6 portfolio-item filter-app'>
							<div className='portfolio-wrap'>
								<Image
									width={1920}
									height={1080}
									src='/img/portfolio/Edith.webp'
									className='img-fluid'
									alt=''
								/>
								<div className='portfolio-info'>
									<h4>E.D.I.T.H</h4>
									{/* <p>Card</p> */}
									<div className='portfolio-links'>
										<a
											href='/img/portfolio/Edith.webp'
											data-gallery='portfolioGallery'
											className='portfolio-lightbox'
											title='E.D.I.T.H'>
											<i className='bx bx-plus'></i>
										</a>
										<a
											href='portfolio-details.html'
											data-gallery='portfolioDetailsGallery'
											data-glightbox='type: external'
											className='portfolio-details-lightbox'
											title='E.D.I.T.H'>
											<i className='bx bx-link'></i>
										</a>
									</div>
								</div>
							</div>
						</div>

						<div className='col-lg-4 col-md-6 portfolio-item filter-bot'>
							<div className='portfolio-wrap'>
								<Image
									width={1920}
									height={1080}
									src='/img/portfolio/Avenger.webp'
									className='img-fluid'
									alt=''
								/>
								<div className='portfolio-info'>
									<h4>Avenger</h4>
									{/* <p>Card</p> */}
									<div className='portfolio-links'>
										<a
											href='/img/portfolio/Avenger.webp'
											data-gallery='portfolioGallery'
											className='portfolio-lightbox'
											title='Avenger'>
											<i className='bx bx-plus'></i>
										</a>
										<a
											href='portfolio-details.html'
											data-gallery='portfolioDetailsGallery'
											data-glightbox='type: external'
											className='portfolio-details-lightbox'
											title='Avenger'>
											<i className='bx bx-link'></i>
										</a>
									</div>
								</div>
							</div>
						</div>

						<div className='col-lg-4 col-md-6 portfolio-item filter-bot'>
							<div className='portfolio-wrap'>
								<Image
									width={1920}
									height={1080}
									src='/img/portfolio/Musics_DJ.webp'
									className='img-fluid'
									alt=''
								/>
								<div className='portfolio-info'>
									<h4>Musics_DJ</h4>
									{/* <p>Web</p> */}
									<div className='portfolio-links'>
										<a
											href='/img/portfolio/Musics_DJ.webp'
											data-gallery='portfolioGallery'
											className='portfolio-lightbox'
											title='Musics_DJ'>
											<i className='bx bx-plus'></i>
										</a>
										<a
											href='portfolio-details.html'
											data-gallery='portfolioDetailsGallery'
											data-glightbox='type: external'
											className='portfolio-details-lightbox'
											title='Musics_DJ'>
											<i className='bx bx-link'></i>
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}

export default Portfolio
