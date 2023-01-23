import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { Contact, Header, Navbar, Portfolio, Skills } from '@import/components'
import { ProfilePic } from '@import/image'
import { InterestData } from '@import/data'

const Home: NextPage = () => {
	useEffect(() => {
		navigator.onLine
			? toast.success('You are online!')
			: toast.error('You are offline!', { autoClose: false })
	})

	return (
		<>
			<Header canonical='/' />
			<Navbar />
			<section
				id='about'
				className='about'>
				<div className='about-me container'>
					<div
						className='section-title'
						data-aos='fade-right'>
						<h2>About</h2>
						<p>Learn more about me</p>
					</div>

					<div className='row'>
						<div
							className='col-lg-4'
							data-aos='fade-right'>
							<Image
								src={ProfilePic}
								className='img-fluid'
								alt='koushikpuppala'
							/>
						</div>
						<div
							className='col-lg-8 pt-4 pt-lg-0 content'
							data-aos='fade-left'>
							<h3>Student &amp; Full Stack Developer</h3>
							<p className='fst-italic'>
								I&apos;m a B.Tech student studying computer science and engineering
								at the Indian Institute of Information Technology, Raichur. I work
								as a web developer and lead the Google Developer Student Clubs at
								the Indian Institute of Information Technology, Raichur. I&apos;m
								currently working on a Discord bot and full-stack web development
								projects. I began exploring Typescript and Python. I developed a few
								basic websites, full-stack web development projects, a desktop
								screen recorder program, and Discord Bots for server customization
								and entertainment.
							</p>
							<div className='row'>
								<div className='col-lg-6 mt-2'>
									<ul>
										<li>
											<i className='bi bi-chevron-right'></i>{' '}
											<strong>Birthday:</strong> <span>23rd May 2003</span>
										</li>
									</ul>
								</div>
								<div className='col-lg-6 mt-2'>
									<ul>
										<li>
											<i className='bi bi-chevron-right'></i>{' '}
											<strong>Email:</strong>{' '}
											<span>
												<Link href='mailto:contact@koushikpuppala.com'>
													contact@koushikpuppala.com
												</Link>
											</span>
										</li>
									</ul>
								</div>
								<div className='col-lg-6 mt-2'>
									<ul>
										<li>
											<i className='bi bi-chevron-right'></i>{' '}
											<strong>Freelance:</strong>{' '}
											<span>
												Available (
												<Link
													href='/resume'
													className='resume-lightbox'>
													View Resume
												</Link>
												)
											</span>
										</li>
									</ul>
								</div>
								<div className='col-lg-6 mt-2'>
									<ul>
										<li>
											<i className='bi bi-chevron-right'></i>{' '}
											<strong>Website:</strong>{' '}
											<span>
												<Link href='/'>koushikpuppala.com</Link>
											</span>
										</li>
									</ul>
								</div>
								<div className='col-lg-12 mt-2'>
									<ul>
										<li>
											<i className='bi bi-chevron-right'></i>{' '}
											<strong>Degree:</strong>{' '}
											<span>
												Bachelor of Technology in Computer Science and
												Engineering
											</span>
										</li>
									</ul>
								</div>
								<div className='col-lg-12 mt-2'>
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
							</div>
						</div>
					</div>
				</div>
				<Skills />
				<div className='interests container'>
					<div
						className='section-title'
						data-aos='fade-right'>
						<h2>Interests</h2>
					</div>

					<div className='row'>
						{InterestData.map(interest => (
							<div
								className='col-lg-3 mt-4'
								data-aos='fade-up'
								key={interest.id}>
								<div
									className='icon-box'
									data-aos='flip-left'>
									<i
										className={interest.icon}
										style={{ color: interest.color }}></i>
									<h3>{interest.name}</h3>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
			<Portfolio />
			<Contact />
		</>
	)
}

export default Home
