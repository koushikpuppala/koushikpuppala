import Image from 'next/image'
import React from 'react'
import styles from '../stylesheets/components/Navbar.module.scss'
// import { NavActions } from '../Actions/Navbar'

class Navbar extends React.Component {
	componentDidMount() {
		// NavActions()
	}

	render() {
		return (
			<div>
				<i
					className={[
						'bi bi-list d-xl-none bx-tada-hover',
						styles['mobile-nav-toggle'],
					].join(' ')}></i>

				<header id='header'>
					<div className='d-flex flex-column'>
						<div className={styles['profile']}>
							<Image
								src='/images/other/Koushik.webp'
								alt='Koushik'
								className='img-fluid rounded-circle'
								width={250}
								height={250}
							/>
							<h1 className='text-light'>Koushik Puppala</h1>
							<div className='social-links mt-3 text-center'>
								<a
									href='https://github.koushikpuppala.live'
									target='_blank'
									rel='noopener noreferrer'
									className='github bx-tada-hover'>
									<i className='bx bxl-github'>
										<span
											style={{
												display: 'none',
											}}>
											Github
										</span>
									</i>
								</a>
								<a
									href='https://www.facebook.com/puppalakoushik'
									target='_blank'
									rel='noopener noreferrer'
									className='facebook bx-tada-hover'>
									<i className='bx bxl-facebook'>
										<span
											style={{
												display: 'none',
											}}>
											Facebook
										</span>
									</i>
								</a>
								<a
									href='https://instagram.com/koushikpuppala'
									target='_blank'
									rel='noopener noreferrer'
									className='instagram bx-tada-hover'>
									<i className='bx bxl-instagram'>
										<span
											style={{
												display: 'none',
											}}>
											Instagram
										</span>
									</i>
								</a>
								<a
									href='https://twitter.com/puppala_koushik'
									target='_blank'
									rel='noopener noreferrer'
									className='twitter bx-tada-hover'>
									<i className='bx bxl-twitter'>
										<span
											style={{
												display: 'none',
											}}>
											Twitter
										</span>
									</i>
								</a>
								<a
									href='https://linkedin.koushikpuppala.live'
									target='_blank'
									rel='noopener noreferrer'
									className='linkedin bx-tada-hover'>
									<i className='bx bxl-linkedin'>
										<span
											style={{
												display: 'none',
											}}>
											Linkedin
										</span>
									</i>
								</a>
								<a
									href='https://discord.koushikpuppala.live'
									target='_blank'
									rel='noopener noreferrer'
									className='discord bx-tada-hover'>
									<i className='bx bxl-discord'>
										<span
											style={{
												display: 'none',
											}}>
											Discord
										</span>
									</i>
								</a>
							</div>
						</div>

						<nav id='navbar' className={[styles['nav-menu'], 'navbar'].join(' ')}>
							<ul>
								<li>
									<a
										href='#hero'
										className={['nav-link', 'scrollto', styles['active']].join(
											' '
										)}>
										<i className='bx bx-home'></i> <span>Home</span>
									</a>
								</li>
								<li>
									<a href='#about' className='nav-link scrollto'>
										<i className='bx bx-user'></i> <span>About</span>
									</a>
								</li>
								<li>
									<a href='#skills' className='nav-link scrollto'>
										<i className='bx bx-unite'></i> <span>Skills</span>
									</a>
								</li>
								<li>
									<a href='#portfolio' className='nav-link scrollto'>
										<i className='bx bx-book-content'></i>
										<span>Portfolio</span>
									</a>
								</li>
								<li>
									<a href='#tech' className='nav-link scrollto'>
										<i className='bx bx-layer'></i>
										<span>Technologies</span>
									</a>
								</li>
								<li>
									<a
										type='button'
										data-bs-toggle='modal'
										data-bs-target='#staticBackdrop'
										href='#contact'
										className='nav-link scrollto bx-flashing-hover'>
										<i className='bx bx-envelope'></i> <span>Contact</span>
									</a>
								</li>
							</ul>
						</nav>
					</div>
				</header>
			</div>
		)
	}
}

export default Navbar
