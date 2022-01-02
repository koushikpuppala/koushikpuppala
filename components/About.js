import React from 'react'

export default class About extends React.Component {
	render() {
		return (
			<div>
				<section id='about' className='about'>
					<div className='container'>
						<div className='section-title'>
							<h2 data-aos='fade-right'>About</h2>
							<h3
								data-aos='fade-left'
								style={{
									fontFamily: 'Playfair Display, serif',
								}}>
								Hello Friends, I am <strong>Koushik Puppala</strong> student of
								Bachelor of Technology in Computer Science and Engineering at the
								Indian Institute of Information Technology Raichur, which is
								controlled by the Indian Institute of Technology Hyderabad.
							</h3>
						</div>
						<div className='row'>
							<div className='col-lg-4' data-aos='fade-right'>
								<img
									src='/images/other/Icon.webp'
									className='img-fluid'
									alt='Icon'
									width={720}
									height={720}
								/>
							</div>
							<div className='col-lg-8 pt-4 pt-lg-0 content' data-aos='fade-left'>
								<h3>Student &amp; Web Developer:</h3>
								<h4 className='fst-italic'>
									I am a Full Stack Web Developer. I have made some projects like
									Websites, Discord Bots for the Discord Server and made One
									Desktop App.
								</h4>
								<br />
								<div className='row'>
									<div className='col-lg-6'>
										<ul>
											<li data-aos='flip-left'>
												<i className='bi bi-chevron-right'></i>{' '}
												<strong>Name:</strong> <span>Koushik Puppala</span>
											</li>
											<li data-aos='flip-left'>
												<i className='bi bi-chevron-right'></i>{' '}
												<strong>City:</strong>{' '}
												<span>
													Rajahmundry, East Godavari, Andhra Pradesh,
													India
												</span>
											</li>
											<li data-aos='flip-left'>
												<i className='bi bi-chevron-right'></i>{' '}
												<strong>Email:</strong>{' '}
												<a href='mailto:contact@koushikpuppala.live'>
													<span>contact@koushikpuppala.live</span>
												</a>
											</li>
											<li data-aos='flip-left'>
												<i className='bi bi-chevron-right'></i>{' '}
												<strong>Website:</strong>{' '}
												<a
													href='https://koushikpuppala.live'
													target='_blank'
													rel='noopener noreferrer'>
													<span>koushikpuppala.live</span>
												</a>
											</li>
										</ul>
									</div>
									<div className='col-lg-6'>
										<ul>
											<li data-aos='flip-left'>
												<i className='bi bi-chevron-right'></i>{' '}
												<strong>Degree:</strong>{' '}
												<span>
													Bachelor of Technology Computer Science Engineer
												</span>
											</li>
											<li data-aos='flip-left'>
												<i className='bi bi-chevron-right'></i>{' '}
												<strong>College:</strong>{' '}
												<span>
													Indian Institute of Information Technology,
													Raichur Karnataka.
												</span>
											</li>
											<li data-aos='flip-left'>
												<i className='bi bi-chevron-right'></i>{' '}
												<strong>Freelance:</strong> <span>Available</span>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		)
	}
}
