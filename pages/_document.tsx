/* eslint-disable @next/next/next-script-for-ga */
/* eslint-disable @next/next/no-sync-scripts */
import { Html, Head, Main, NextScript } from 'next/document'

const Document = () => {
	return (
		<Html lang='en'>
			<Head>
				<meta
					name='theme-color'
					content='#18d26e'
				/>
				<link
					rel='manifest'
					href='/main.webmanifest'
				/>
				<link
					href='https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Raleway:300,300i,400,400i,500,500i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i&display=optional'
					rel='stylesheet'
				/>

				<script
					async
					src='https://arc.io/widget.min.js#RdPYzCBC'
				/>
				<script
					async
					id='google-ca-pub-9586492413519336'
					src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9586492413519336'
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
					src='https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js'
					integrity='sha384-A3rJD856KowSb7dwlZdYEkO39Gagi7vIsF0jrRAoQmDKKtQBHUuLZ9AsSv4jD4Xa'
					crossOrigin='anonymous'
				/>
				<NextScript />
			</body>
		</Html>
	)
}

export default Document
