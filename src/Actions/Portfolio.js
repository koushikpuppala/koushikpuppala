/** @format */

import { select, on } from './Default'
import Isotope from 'isotope-layout'
import AOS from 'aos'

export const PortfolioActions = () => {
	/**
	 * Portfolio isotope and filter
	 */
	window.addEventListener('load', () => {
		const portfolioContainer = select('.portfolio-container')
		if (portfolioContainer) {
			const portfolioIsotope = new Isotope(portfolioContainer, {
				itemSelector: '.portfolio-item',
			})

			const portfolioFilters = select('#portfolio-filters li', true)

			on(
				'click',
				'#portfolio-filters li',
				function (e) {
					e.preventDefault()
					portfolioFilters.forEach((el) => {
						el.classList.remove('filter-active')
					})
					this.classList.add('filter-active')

					portfolioIsotope.arrange({
						filter: this.getAttribute('data-filter'),
					})
					portfolioIsotope.on('arrangeComplete', () => {
						AOS.refresh()
					})
				},
				true
			)
		}
	})
}
