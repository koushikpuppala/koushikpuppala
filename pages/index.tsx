import type { NextPage } from 'next'
import Image from 'next/image'
import { useEffect } from 'react'
import { Contact, Header, Navbar, Portfolio, Skills } from '../components'

const Home: NextPage = () => {
	return (
		<>
			<Header />
			<Navbar />
			<section id='about' className='about'>
				<div className='about-me container'>
					<div className='section-title'>
						<h2>About</h2>
						<p>Learn more about me</p>
					</div>

					<div className='row'>
						<div className='col-lg-4' data-aos='fade-right'>
							<Image
								width={100}
								height={100}
								layout='responsive'
								src='/img/Koushikpuppala.png'
								className='img-fluid'
								alt='koushikpuppala'
							/>
						</div>
						<div className='col-lg-8 pt-4 pt-lg-0 content' data-aos='fade-left'>
							<h3>Student &amp; Full Stack Developer</h3>
							<p className='fst-italic'>
								Hello Friends, I am Koushik Puppala student of Bachelor of
								Technology in Computer Science and Engineering at Indian Institute
								of Information Technology Raichur.
							</p>
							<div className='row'>
								<div className='col-lg-6 mt-2'>
									<ul>
										<li>
											<i className='bi bi-chevron-right'></i>{' '}
											<strong>Birthday:</strong> <span>23 May 2003</span>
										</li>
									</ul>
								</div>
								<div className='col-lg-6 mt-2'>
									<ul>
										<li>
											<i className='bi bi-chevron-right'></i>{' '}
											<strong>City:</strong>{' '}
											<span>Rajahmundry Andhra Pradesh, India</span>
										</li>
									</ul>
								</div>
								<div className='col-lg-6 mt-2'>
									<ul>
										<li>
											<i className='bi bi-chevron-right'></i>{' '}
											<strong>Degree:</strong>{' '}
											<span>
												Bachelor of Technology Computer Science Engineer
											</span>
										</li>
									</ul>
								</div>
								<div className='col-lg-6 mt-2'>
									<ul>
										<li>
											<i className='bi bi-chevron-right'></i>{' '}
											<strong>College:</strong>{' '}
											<span>
												Indian Institute of Information Technology, Raichur
												Karnataka.
											</span>
										</li>
									</ul>
								</div>
								<div className='col-lg-6 mt-2'>
									<ul>
										<li>
											<i className='bi bi-chevron-right'></i>{' '}
											<strong>Email:</strong> <span>email@example.com</span>
										</li>
									</ul>
								</div>
								<div className='col-lg-6 mt-2'>
									<ul>
										<li>
											<i className='bi bi-chevron-right'></i>{' '}
											<strong>Website:</strong>{' '}
											<span>koushikpuppala.com</span>
										</li>
									</ul>
								</div>
								<div className='col-lg-6 mt-2'>
									<ul>
										<li>
											<i className='bi bi-chevron-right'></i>{' '}
											<strong>Freelance:</strong> <span>Available</span>
										</li>
									</ul>
								</div>
							</div>
							<p>
								Working as a Full Stack Developer in USA Based Company. Created a
								few Projects on Full Stack, a few basic HTML Websites, developed
								Discord Bots for the Discord Server Customization and Fun in Discord
								and made one Desktop Screen Recording App.
							</p>
						</div>
					</div>
				</div>
				<Skills />
				<div className='interests container'>
					<div className='section-title'>
						<h2>Interests</h2>
					</div>

					<div className='row'>
						<div className='col-lg-3 mt-4'>
							<div className='icon-box'>
								<i className='ri-store-line' style={{ color: ' #ffbb2c' }}></i>
								<h3>Full Stack Development</h3>
							</div>
						</div>
						<div className='col-lg-3 mt-4'>
							<div className='icon-box'>
								<i
									className='ri-bar-chart-box-line'
									style={{ color: '#5578ff' }}></i>
								<h3>Android App Development</h3>
							</div>
						</div>
						<div className='col-lg-3 mt-4'>
							<div className='icon-box'>
								<i
									className='ri-calendar-todo-line'
									style={{ color: ' #e80368' }}></i>
								<h3>Game Development</h3>
							</div>
						</div>
						<div className='col-lg-3 mt-4'>
							<div className='icon-box'>
								<i className='ri-paint-brush-line' style={{ color: '#e361ff' }}></i>
								<h3>Artificial Intelligence</h3>
							</div>
						</div>
						<div className='col-lg-3 mt-4'>
							<div className='icon-box'>
								<i className='ri-database-2-line' style={{ color: ' #47aeff' }}></i>
								<h3>Machine Learning</h3>
							</div>
						</div>
						<div className='col-lg-3 mt-4'>
							<div className='icon-box'>
								<i className='ri-gradienter-line' style={{ color: ' #ffa76e' }}></i>
								<h3>Discord Bots</h3>
							</div>
						</div>
						<div className='col-lg-3 mt-4'>
							<div className='icon-box'>
								<i
									className='ri-file-list-3-line'
									style={{ color: ' #11dbcf' }}></i>
								<h3>Open Source</h3>
							</div>
						</div>
						<div className='col-lg-3 mt-4'>
							<div className='icon-box'>
								<i className='ri-price-tag-2-line' style={{ color: '#4233ff' }}></i>
								<h3>MERN Stack Development</h3>
							</div>
						</div>
					</div>
				</div>
			</section>
			<Portfolio />
			<Contact />
		</>
	)
}

export default Home
