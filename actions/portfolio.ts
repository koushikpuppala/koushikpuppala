const Portfolio = () => {
	/**
	 * Portfolio isotope and filter
	 */
	if (typeof window !== 'undefined') {
		const Isotope = require('isotope-layout')
		const GLightbox = require('glightbox')

		window.addEventListener('load', () => {
			const portfolioContainer = document.querySelector('.portfolio-container') as HTMLElement
			const portfolioFilters = document.querySelectorAll(
				'#portfolio-flters li'
			) as NodeListOf<HTMLElement>

			if (portfolioContainer) {
				const portfolioIsotope = new Isotope(portfolioContainer, {
					itemSelector: '.portfolio-item',
					layoutMode: 'fitRows',
				})

				portfolioFilters.forEach(filter => {
					filter.addEventListener('click', e => {
						e.preventDefault()
						portfolioFilters.forEach(filter => filter.classList.remove('filter-active'))
						filter.classList.add('filter-active')
						portfolioIsotope.arrange({
							filter: filter.getAttribute('data-filter') as string,
						})
					})
				})
			}
		})

		/**
		 * Initiate portfolio lightbox
		 */
		const portfolioLightbox = GLightbox({
			selector: '.portfolio-lightbox',
		})

		/**
		 * Initiate portfolio details lightbox
		 */
		const portfolioDetailsLightbox = GLightbox({
			selector: '.portfolio-details-lightbox',
			width: '90%',
			height: '90vh',
		})
	}
}

export default Portfolio
