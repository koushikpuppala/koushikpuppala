/** @format */

import { select, on, onscroll, scrollto } from './Default'

export const NavActions = () => {
	/**
	 * Navbar links active state on scroll
	 */
	let navbarlinks = select('#navbar .scrollto', true)
	const navbarlinksActive = () => {
		let position = window.scrollY + 200
		navbarlinks.forEach((navbarlink) => {
			if (!navbarlink.hash) return
			let section = select(navbarlink.hash)
			if (!section) return
			if (
				position >= section.offsetTop &&
				position <= section.offsetTop + section.offsetHeight
			) {
				navbarlink.classList.add('active')
				navbarlink.classList.add('bx-flashing')
			} else {
				navbarlink.classList.remove('active')
				navbarlink.classList.remove('bx-flashing')
			}
		})
	}
	window.addEventListener('load', navbarlinksActive)
	onscroll(document, navbarlinksActive)

	/**
	 * Mobile nav toggle
	 */
	on('click', '.mobile-nav-toggle', function (e) {
		select('body').classList.toggle('mobile-nav-active')
		this.classList.toggle('bi-list')
		this.classList.toggle('bi-x')
	})

	/**
	 * Scroll with offset on links with a class name .scrollto
	 */
	on(
		'click',
		'.scrollto',
		function (e) {
			e.preventDefault()

			let body = select('body')
			if (body.classList.contains('mobile-nav-active')) {
				body.classList.remove('mobile-nav-active')
				let navbarToggle = select('.mobile-nav-toggle')
				navbarToggle.classList.toggle('bi-list')
				navbarToggle.classList.toggle('bi-x')
			}
			if (select(this.hash)) {
				scrollto(this.hash)
			}
		},
		true
	)

	/**
	 * Scroll with offset on page load with hash links in the url
	 */
	window.addEventListener('load', () => {
		if (window.location.hash) {
			if (select(window.location.hash)) {
				scrollto(window.location.hash)
			}
		}
	})
}
