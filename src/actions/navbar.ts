import Typed from 'typed.js'

const Navbar = () => {
	const navLinks: NodeListOf<HTMLElement> = document.querySelectorAll('#navbar .nav-link')
	const sections: NodeListOf<HTMLElement> = document.querySelectorAll('section')
	const mobileNavToggle = document.getElementById('mobile-nav-toggle') as HTMLElement
	const navbar = document.getElementById('navbar') as HTMLElement
	const header = document.getElementById('header') as HTMLElement

	/**
	 * Word Typing Animation
	 */
	const options = {
		strings: ['Student', 'Learner', 'Programmer', 'Full Stack Developer', 'Freelancer'],
		typeSpeed: 50,
		backSpeed: 50,
		loop: true,
		cursorChar: '|',
		shuffle: true,
	}
	new Typed('#typed', options)

	/**
	 * Mobile nav toggle
	 */
	mobileNavToggle.addEventListener('click', () => {
		navbar.classList.toggle('navbar-mobile')
		mobileNavToggle.classList.toggle('bi-list')
		mobileNavToggle.classList.toggle('bi-x')
	})

	/**
	 * Scroll with offset on links with a class name .scrollto
	 */
	navLinks.forEach(link => {
		link.addEventListener('click', e => {
			e.preventDefault()
			const href = link.getAttribute('href') as string

			const section = document.querySelector(href) as HTMLElement

			if (section) {
				navLinks.forEach(item => {
					item.classList.remove('active')
				})

				link.classList.add('active')

				if (navbar.classList.contains('navbar-mobile')) {
					navbar.classList.remove('navbar-mobile')
					mobileNavToggle.classList.toggle('bi-list')
					mobileNavToggle.classList.toggle('bi-x')
				}

				if (href === '#header') {
					header.classList.remove('header-top')
					sections.forEach(item => {
						item.classList.remove('section-show')
					})
					return
				}

				if (!header.classList.contains('header-top')) {
					header.classList.add('header-top')

					setTimeout(() => {
						sections.forEach(item => {
							item.classList.remove('section-show')
						})
						section.classList.add('section-show')
					}, 350)
				} else {
					sections.forEach(item => {
						item.classList.remove('section-show')
					})
					section.classList.add('section-show')
				}

				window.scrollTo({
					top: 0,
					behavior: 'smooth',
				})
			}
		})
	})

	/**
	 * Activate/show sections on load with hash links
	 */
	window.addEventListener('load', () => {
		if (window.location.hash) {
			let initial_nav = document.querySelector(window.location.hash) as HTMLElement

			if (initial_nav) {
				header.classList.add('header-top')

				navLinks.forEach(item => {
					if (item.getAttribute('href') == window.location.hash) {
						item.classList.add('active')
					} else {
						item.classList.remove('active')
					}
				})

				setTimeout(function () {
					initial_nav.classList.add('section-show')
				}, 350)

				window.scrollTo({
					top: 0,
					behavior: 'smooth',
				})
			}
		}
	})
}

export default Navbar
