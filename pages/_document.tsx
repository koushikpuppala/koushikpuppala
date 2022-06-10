import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

const Document = () => {
	return (
		<Html>
			<Head>
				<meta name='theme-color' content='#18d26e' />
				<link rel='manifest' href='/main.webmanifest' />
				<link
					href='https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Raleway:300,300i,400,400i,500,500i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i&display=optional'
					rel='stylesheet'
				/>

				<script
					async
					id='google-ca-pub-6510875727156988'
					src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6510875727156988'
					crossOrigin='anonymous'
				/>
				<script
					async
					src='https://www.googletagmanager.com/gtag/js?id=G-VFZBVWQG74'
					crossOrigin='anonymous'
				/>
				<script id='google-analytics'>
					{`
						window.dataLayer = window.dataLayer || []
						function gtag() {
							dataLayer.push(arguments)
						}
						gtag('js', new Date())
						gtag('config', 'G-VFZBVWQG74')
					`}
				</script>
				<script id='google-tag-manager'>
					{`
						;(function (w, d, s, l, i) {
							w[l] = w[l] || []
							w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
							var f = d.getElementsByTagName(s)[0],
								j = d.createElement(s),
								dl = l != 'dataLayer' ? '&l=' + l : ''
							j.async = true
							j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl
							f.parentNode.insertBefore(j, f)
						})(window, document, 'script', 'dataLayer', 'GTM-KM9WPPS')
					`}
				</script>
			</Head>
			<body>
				<noscript>
					<iframe
						src='https://www.googletagmanager.com/ns.html?id=GTM-KM9WPPS'
						height='0'
						width='0'
						style={{ display: 'none', visibility: 'hidden' }}></iframe>
				</noscript>
				<Main />

				<script
					async
					src='https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js'
					integrity='sha384-pprn3073KE6tl6bjs2QrFaJGz5/SUsLqktiwsUTF55Jfv3qYSDhgCecCxMW52nD2'
					crossOrigin='anonymous'
				/>
				<script
					async
					src='https://cdnjs.cloudflare.com/ajax/libs/waypoints/4.0.1/noframework.waypoints.min.js'
				/>

				<script async type='text/javascript' src='js/index.js' />
				<NextScript />
			</body>
		</Html>
	)
}

export default Document
