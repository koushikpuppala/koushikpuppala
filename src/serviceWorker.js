/** @format */

export default class serviceWorker {
	constructor() {
		this.registration = null

		if ('serviceWorker' in navigator) {
			// Registration not possible on IE, so don't even try
			if (navigator.serviceWorker.controller) {
				this.registration = navigator.serviceWorker
			}

			let swUrl = `${process.env.PUBLIC_URL}/serviceWorker.js`
			navigator.serviceWorker.register(swUrl).then((response) => {
				console.warn('response', response)
			})
		}
	}
}
