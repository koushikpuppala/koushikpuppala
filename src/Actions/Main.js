/** @format */

import AOS from 'aos'

export const MainAction = () => {
	/**
	 * Animation on scroll
	 */
	window.addEventListener('load', () => {
		AOS.init({
			duration: 1000,
			easing: 'ease-in-out',
			once: true,
			mirror: false,
		})
	})
}
