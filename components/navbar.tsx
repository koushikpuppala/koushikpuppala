import { useEffect } from 'react'
import { NavbarAction } from '@import/actions'
import { Box, Link, Typography } from '@mui/material'

const Navbar = () => {
	useEffect(() => {
		NavbarAction()
	}, [])
	return (
		<>
			<header id='header'>
				<Box className='container'>
					<Typography variant='h1'>Koushik Puppala</Typography>
					<Typography variant='h2'>
						I&apos;m a <span id='typed'></span> from India
					</Typography>

					<nav
						id='navbar'
						className='navbar'>
						<ul>
							<li>
								<Link
									className='nav-link active'
									href='#header'>
									Home
								</Link>
							</li>
							<li>
								<Link
									className='nav-link'
									href='#about'>
									About
								</Link>
							</li>
							<li>
								<Link
									className='nav-link'
									href='#portfolio'>
									Portfolio
								</Link>
							</li>
							<li>
								<Link
									className='nav-link'
									href='#contact'>
									Contact
								</Link>
							</li>
						</ul>
						<i
							id='mobile-nav-toggle'
							className='bi bi-list'></i>
					</nav>

					<Box className='social-links'>
						<Link
							href='/linkedin'
							target='_blank'
							rel='noreferrer'
							aria-label='LinkedIn'
							className='bi bi-linkedin'></Link>
						<Link
							href='/github'
							target='_blank'
							rel='noreferrer'
							aria-label='GitHub'
							className='bi bi-github'></Link>
						<Link
							href='/discord'
							target='_blank'
							rel='noreferrer'
							aria-label='Discord'
							className='bi bi-discord'></Link>
						<Link
							href='/instagram'
							target='_blank'
							rel='noreferrer'
							aria-label='Instagram'
							className='bi bi-instagram'></Link>
						<Link
							href='/twitter'
							target='_blank'
							rel='noreferrer'
							aria-label='Twitter'
							className='bi bi-twitter'></Link>
						<Link
							href='/facebook'
							target='_blank'
							rel='noreferrer'
							aria-label='Facebook'
							className='bi bi-facebook'></Link>
					</Box>
				</Box>
			</header>
		</>
	)
}

export default Navbar
