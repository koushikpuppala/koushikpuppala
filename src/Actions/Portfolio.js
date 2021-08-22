/** @format */

import { select, on } from './Default'
import Swiper from 'swiper/bundle'
import Isotope from 'isotope-layout'
import AOS from 'aos'

export const PortfolioActions = () => {
	/**
	 * Portfolio isotope and filter
	 */
	window.addEventListener('load', () => {
		let portfolioContainer = select('.portfolio-container')
		if (portfolioContainer) {
			let portfolioIsotope = new Isotope(portfolioContainer, {
				itemSelector: '.portfolio-item',
			})

			let portfolioFilters = select('#portfolio-filters li', true)

			on(
				'click',
				'#portfolio-filters li',
				function (e) {
					e.preventDefault()
					portfolioFilters.forEach(function (el) {
						el.classList.remove('filter-active')
					})
					this.classList.add('filter-active')

					portfolioIsotope.arrange({
						filter: this.getAttribute('data-filter'),
					})
					portfolioIsotope.on('arrangeComplete', function () {
						AOS.refresh()
					})
				},
				true
			)
		}
	})

	/**
	 * Portfolio details slider
	 */
	new Swiper('.portfolio-details-slider', {
		speed: 400,
		loop: true,
		autoplay: {
			delay: 5000,
			disableOnInteraction: false,
		},
		pagination: {
			el: '.swiper-pagination',
			type: 'bullets',
			clickable: true,
		},
	})
}
