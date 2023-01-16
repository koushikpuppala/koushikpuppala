const Portfolio = () => {
	/**
	 * Portfolio isotope and filter
	 */
	if (typeof window !== 'undefined') {
		const Isotope = require('isotope-layout')
		const GLightbox = require('glightbox')

		window.addEventListener('load', () => {
			const portfolioContainer = document.querySelector('.portfolio-container') as HTMLElement
			const portfolioFilters: NodeListOf<HTMLElement> =
				document.querySelectorAll('#portfolio-filters li')

			if (portfolioContainer) {
				const portfolioIsotope = new Isotope(portfolioContainer, {
					itemSelector: '.portfolio-item',
					layoutMode: 'fitRows',
				})

				portfolioFilters.forEach(filter => {
					filter.addEventListener('click', e => {
						e.preventDefault()
						portfolioFilters.forEach(item => item.classList.remove('filter-active'))
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
		GLightbox({
			selector: '.portfolio-lightbox',
		})
		GLightbox({
			selector: '.resume-lightbox',
			width: '90%',
			height: '90vh',
			closeOnOutsideClick: false,
		})
	}
}

export default Portfolio
