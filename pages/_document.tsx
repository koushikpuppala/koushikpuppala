import Document, { Html, Head, Main, NextScript } from 'next/document'
import createEmotionServer from '@emotion/server/create-instance'
import createEmotionCache from '@import/createEmotionCache'
import { DocumentProps } from '@import/interface'
import Script from 'next/script'

export default class MyDocument extends Document<DocumentProps> {
	render() {
		return (
			<Html lang='en'>
				<Head>
					<meta
						name='theme-color'
						content='#18d26e5a'
					/>
					<link
						rel='manifest'
						href='/main.webmanifest'
					/>
					<meta
						name='emotion-insertion-point'
						content=''
					/>
					{this.props.emotionStyleTags}
					<Script
						id='google-ca-pub-9586492413519336'
						strategy='lazyOnload'
						src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9586492413519336'
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
				</Head>
				<body>
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
	const emotionStyleTags = emotionStyles.styles.map(style => (
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
