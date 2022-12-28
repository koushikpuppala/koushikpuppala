import Document, { Html, Head, Main, NextScript } from 'next/document'
import createEmotionServer from '@emotion/server/create-instance'
import createEmotionCache from '@import/createEmotionCache'
import Script from 'next/script'

export default class MyDocument extends Document {
	render() {
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
					<meta
						name='emotion-insertion-point'
						content=''
					/>
					{(this.props as any).emotionStyleTags}
					<link
						rel='preconnect'
						href='https://fonts.googleapis.com/'
						crossOrigin='anonymous'
					/>
					<link
						rel='preconnect'
						href='https://www.googletagmanager.com'
						crossOrigin='anonymous'
					/>
					<link
						rel='preconnect'
						href='https://cdn.jsdelivr.net'
						crossOrigin='anonymous'
					/>
					<link
						href='https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Raleway:300,300i,400,400i,500,500i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i|Roboto:300,400,500,700&display=swap'
						rel='stylesheet'
					/>
					<link
						rel='stylesheet'
						href='https://fonts.googleapis.com/icon?family=Material+Icons'
					/>
					<Script
						strategy='afterInteractive'
						src='https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js'
						integrity='sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3'
						crossOrigin='anonymous'
					/>
					<Script
						strategy='afterInteractive'
						src='https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.min.js'
						integrity='sha384-cuYeSxntonz0PPNlHhBs68uyIAVpIIOZZ5JqeqvYYIcEL727kskC66kF92t6Xl2V'
						crossOrigin='anonymous'
					/>
					<Script
						id='google-analytics-g4'
						src='https://www.googletagmanager.com/gtag/js?id=G-8NPR1DDE8Y'
						strategy='afterInteractive'
					/>
					<Script
						strategy='afterInteractive'
						id='Google Analytics G4'
						type='text/javascript'
						dangerouslySetInnerHTML={{
							__html: `window.dataLayer = window.dataLayer || [];
						function gtag(){
							dataLayer.push(arguments);
						}
						gtag('js', new Date());
						gtag('config', 'G-8NPR1DDE8Y');`,
						}}
					/>
					<Script
						strategy='afterInteractive'
						id='Google Tag Manager'
						type='text/javascript'
						dangerouslySetInnerHTML={{
							__html: `;(function (w, d, s, l, i) {
							w[l] = w[l] || []
							w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
							var f = d.getElementsByTagName(s)[0],
								j = d.createElement(s),
								dl = l != 'dataLayer' ? '&l=' + l : ''
							j.async = true
							j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl
							f.parentNode.insertBefore(j, f)
						})(window, document, 'script', 'dataLayer', 'GTM-KM9WPPS')`,
						}}
					/>
				</Head>
				<body>
					<noscript
						dangerouslySetInnerHTML={{
							__html: `<iframe src='https://www.googletagmanager.com/ns.html?id=GTM-KM9WPPS' height='0' width='0' style='display:none;visibility:hidden'></iframe>`,
						}}
					/>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

MyDocument.getInitialProps = async ctx => {
	const originalRenderPage = ctx.renderPage

	const cache = createEmotionCache()
	const { extractCriticalToChunks } = createEmotionServer(cache)

	ctx.renderPage = () =>
		originalRenderPage({
			enhanceApp: (App: any) =>
				function EnhanceApp(props) {
					return (
						<App
							emotionCache={cache}
							{...props}
						/>
					)
				},
		})

	const initialProps = await Document.getInitialProps(ctx)
	const emotionStyles = extractCriticalToChunks(initialProps.html)
	const emotionStyleTags = emotionStyles.styles.map((style: any) => (
		<style
			data-emotion={`${style.key} ${style.ids.join(' ')}`}
			key={style.key}
			dangerouslySetInnerHTML={{ __html: style.css }}
		/>
	))

	return {
		...initialProps,
		emotionStyleTags,
	}
}
