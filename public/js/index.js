;(function () {
	'use strict'
	const select = (el, all = false) => {
		el = el.trim()
		if (all) {
			return [...document.querySelectorAll(el)]
		} else {
			return document.querySelector(el)
		}
	}
	const on = (type, el, listener, all = false) => {
		let selectEl = select(el, all)

		if (selectEl) {
			if (all) {
				selectEl.forEach((e) => e.addEventListener(type, listener))
			} else {
				selectEl.addEventListener(type, listener)
			}
		}
	}
	let skilsContent = select('.skills-content')
	if (skilsContent) {
		new Waypoint({
			element: skilsContent,
			offset: '80%',
			handler: function (direction) {
				let progress = select('.progress .progress-bar', true)
				progress.forEach((el) => {
					el.style.width = el.getAttribute('aria-valuenow') + '%'
				})
			},
		})
	}
})()
