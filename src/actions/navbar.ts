import Typed from 'typed.js'

const Navbar = (
	headerValue: string,
	headerTop: string,
	active: string,
	nav: string,
	mobileToggle: string,
	mobileNav: string
) => {
	const navLinks: NodeListOf<HTMLElement> = document.querySelectorAll('#navbar .nav-link')
	const sections: NodeListOf<HTMLElement> = document.querySelectorAll('section')
	const mobileNavToggle = document.getElementById(mobileToggle) as HTMLElement
	const navbar = document.getElementById('navbar') as HTMLElement
	const header = document.getElementById(headerValue) as HTMLElement

	/**
	 * Word Typing Animation
	 */
	const options = {
		strings: ['Student', 'Learner', 'Programmer', 'Full Stack Developer', 'Freelancer'],
		typeSpeed: 50,
		backSpeed: 50,
		loop: true,
		cursorChar: '|',
	}
	new Typed('#typed', options)

	/**
	 * Mobile nav toggle
	 */
	mobileNavToggle.addEventListener('click', () => {
		navbar.classList.toggle(mobileNav)
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
					item.classList.remove(active)
				})

				link.classList.add(active)

				if (navbar.classList.contains(mobileNav)) {
					navbar.classList.remove(mobileNav)
					mobileNavToggle.classList.toggle('bi-list')
					mobileNavToggle.classList.toggle('bi-x')
				}

				if (href === `#${headerValue}`) {
					header.classList.remove(headerTop)
					sections.forEach(item => {
						item.classList.remove('section-show')
					})
					return
				}

				if (!header.classList.contains(headerTop)) {
					header.classList.add(headerTop)

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
				header.classList.add(headerTop)

				navLinks.forEach(item => {
					if (item.getAttribute('href') == window.location.hash) {
						item.classList.add(active)
					} else {
						item.classList.remove(active)
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
