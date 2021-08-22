/** @format */

export const NotFoundAction = () => {
	var c = document.getElementById('c')
	var ctx = c.getContext('2d')
	var size = Math.max(window.innerWidth, window.innerHeight)
	c.width = size
	c.height = size

	var startCircles = 100
	var limit = 100
	var circles = []
	var center = {}

	class Circle {
		constructor(x, y) {
			this.x = x
			this.y = y
			this.angle = 0
			this.radius = rand(2, 10)
			this.shade = rand(10, 100) / 100
		}
		end() {
			circles.splice(circles.indexOf(this), 1)
		}
	}

	init()

	function init() {
		limit = Math.max(startCircles, limit)
		circles = []
		ctx.fillStyle = '#0A0A0A'
		ctx.fillRect(0, 0, c.width, c.height)
		for (var i = 0; i < startCircles; i++) {
			setTimeout(() => {
				var x = rand(0, c.width)
				var y = rand(0, c.height)
				circles.push(new Circle(x, y))
			}, startCircles * i)
		}

		var hole = document.getElementsByClassName('black-hole')[0].getBoundingClientRect()
		center.x = hole.left + hole.width / 2
		center.y = hole.top + hole.height / 2
		animate()
	}

	function animate() {
		ctx.fillStyle = 'rgba(10,10,10,0.5)'
		ctx.fillRect(0, 0, c.width, c.height)

		var i = circles.length
		while (i--) {
			var circle = circles[i]
			circle.radius -= 0.05
			circle.radius = Math.abs(circle.radius)

			var vx = ((center.x - circle.x) / Math.abs(circle.y)) * 2
			var vy = ((center.y - circle.y) / Math.abs(circle.x)) * 2

			circle.x += vx
			circle.y += vy

			if (circle.radius <= 0.1) {
				circle.end()
				var x = rand(0, c.width)
				var y = rand(0, c.height)
				circles.push(new Circle(x, y))
			}

			ctx.beginPath()
			ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI, false)
			ctx.fillStyle = 'rgba(0,0,255,' + circle.shade + ')'
			ctx.fill()
			ctx.closePath()
		}

		if (circles.length > limit) {
			circles.shift()
		}

		requestAnimationFrame(animate)
	}

	function rand(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min)
	}

	window.addEventListener('click', function (e) {
		circles.push(new Circle(e.clientX, e.clientY))
	})
}
