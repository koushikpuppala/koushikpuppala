/** @format */

const CACHE_NAME = 'Koushikpuppala'

this.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			cache.addAll([
				// Add other resources you want to cache here.
				'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js',
				'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700',
				'/index.html',
				'/',
				'/main.webmanifest',
				'/logo512.png',
				'/favicon.ico',
				'/logo192.png',
				'/static/js/main.chunk.js',
				'/static/js/0.chunk.js',
				'/static/js/bundle.js',
				'/static/css/main.chunk.css',
				'/static/js/vendors~main.chunk.js',
				'/static/media/Header.cb71361b.webp',
				'/static/media/Koushikpuppala.56e13cc0.webp',
				'/static/media/AvengersAssemble.5b8c629b.webp',
				'/static/media/Jai.7264294a.webp',
				'/static/media/IIITR.79a7c640.webp',
				'/static/media/StudentIIITR.93faa600.webp',
				'/static/media/Edith.dea85378.webp',
				'/static/media/Avenger.a4b64c9b.webp',
				'/static/media/Musics_DJ.d71db66d.webp',
				'/static/media/DiscordLists100.e689c193.webp',
				'/static/media/bootstrap-icons.dfd0ea12.woff2',
				'/static/media/boxicons.af4cc708.woff2',
				'/static/media/Koushik.7d13bd44.webp',
				'/static/media/Icon.e91bc267.webp',
				'/static/media/React.b4017fa0.webp',
				'/static/media/Mongo.6666becd.webp',
				'/static/media/Node.c0f3d750.webp',
				'/static/media/Git.847dadf8.webp',
				'/static/media/CSS.c64ff42e.webp',
				'/static/media/JavaScript.318715c7.webp',
				'/static/media/Express.bb79d1c7.webp',
				'/static/media/Firebase.ba176bed.webp',
				'/static/media/VisualStudio.1f06ad47.webp',
				'/static/media/HTML5.bd9f553d.webp',
				'/static/media/EJS.fd3730a2.webp',
				'/static/media/Docker.f94d81bb.webp',
				'/static/media/bootstrap-icons.94eeade1.woff',
				'/static/media/boxicons.6ee3db6f.woff',
				'/static/media/boxicons.426af27b.ttf',
			])
		})
	)
})

this.addEventListener('fetch', (event) => {
	if (!navigator.onLine) {
		event.respondWith(
			caches.match(event.request).then((resp) => {
				if (resp) {
					return resp
				}
				let requestUrl = event.request.clone()
				fetch(requestUrl)
			})
		)
	}
})
