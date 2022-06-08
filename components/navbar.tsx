import type { NextComponentType } from 'next'
import Link from 'next/link'
import { useEffect } from 'react'
import { NavbarAction } from '../actions'

const Navbar: NextComponentType = () => {
	useEffect(() => {
		NavbarAction()
	}, [])
	return (
		<>
			<header id='header'>
				<div className='container'>
					<h1>
						<Link href='/'>Koushik Puppala</Link>
					</h1>
					<h2>
						I&apos;m a <span id='typed'></span> from India
					</h2>

					<nav id='navbar' className='navbar'>
						<ul>
							<li>
								<a className='nav-link active' href='#header'>
									Home
								</a>
							</li>
							<li>
								<a className='nav-link' href='#about'>
									About
								</a>
							</li>
							<li>
								<a className='nav-link' href='#portfolio'>
									Portfolio
								</a>
							</li>
							<li>
								<a className='nav-link' href='#contact'>
									Contact
								</a>
							</li>
						</ul>
						<i id='mobile-nav-toggle' className='bi bi-list'></i>
					</nav>

					<div className='social-links'>
						<a
							href='https://www.linkedin.com/in/koushikpuppala'
							target='_blank'
							rel='noreferrer'
							className='linkedin'>
							<i className='bi bi-linkedin'></i>
						</a>
						<a
							href='https://github.com/koushikpuppala'
							target='_blank'
							rel='noreferrer'
							className='github'>
							<i className='bi bi-github'></i>
						</a>
						<a
							href='https://discord.com/channels/@me/735813371433058354'
							target='_blank'
							rel='noreferrer'
							className='discord'>
							<i className='bi bi-discord'></i>
						</a>
						<a
							href='https://www.instagram.com/koushikpuppala'
							target='_blank'
							rel='noreferrer'
							className='instagram'>
							<i className='bi bi-instagram'></i>
						</a>
						<a
							href='https://twitter.com/puppala_koushik'
							target='_blank'
							rel='noreferrer'
							className='twitter'>
							<i className='bi bi-twitter'></i>
						</a>
						<a
							href='https://www.facebook.com/puppalakoushik'
							target='_blank'
							rel='noreferrer'
							className='facebook'>
							<i className='bi bi-facebook'></i>
						</a>
					</div>
				</div>
			</header>
		</>
	)
}

export default Navbar
