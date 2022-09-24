import { Link, Typography } from '@mui/material'
import type { NextComponentType } from 'next'
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
					<Typography variant='h1'>Koushik Puppala</Typography>
					<Typography variant='h2'>
						I&apos;m a <span id='typed'></span> from India
					</Typography>

					<nav
						id='navbar'
						className='navbar'>
						<ul>
							<li>
								<a
									className='nav-link active'
									href='#header'>
									Home
								</a>
							</li>
							<li>
								<a
									className='nav-link'
									href='#about'>
									About
								</a>
							</li>
							<li>
								<a
									className='nav-link'
									href='#portfolio'>
									Portfolio
								</a>
							</li>
							<li>
								<a
									className='nav-link'
									href='#contact'>
									Contact
								</a>
							</li>
						</ul>
						<i
							id='mobile-nav-toggle'
							className='bi bi-list'></i>
					</nav>

					<div className='social-links'>
						<Link
							href='/linkedin'
							target='_blank'
							rel='noreferrer'
							className='bi bi-linkedin'></Link>
						<Link
							href='/github'
							target='_blank'
							rel='noreferrer'
							className='bi bi-github'></Link>
						<Link
							href='/discord'
							target='_blank'
							rel='noreferrer'
							className='bi bi-discord'></Link>
						<Link
							href='/instagram'
							target='_blank'
							rel='noreferrer'
							className='bi bi-instagram'></Link>
						<Link
							href='/twitter'
							target='_blank'
							rel='noreferrer'
							className='bi bi-twitter'></Link>
						<Link
							href='/facebook'
							target='_blank'
							rel='noreferrer'
							className='bi bi-facebook'></Link>
					</div>
				</div>
			</header>
		</>
	)
}

export default Navbar
