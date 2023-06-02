import 'bootstrap/dist/css/bootstrap.min.css'
import 'glightbox/dist/css/glightbox.min.css'
import 'boxicons/css/boxicons.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'react-toastify/dist/ReactToastify.css'
import 'remixicon/fonts/remixicon.css'
import 'aos/dist/aos.css'
import '@import/styles/globals.scss'
import { useEffect } from 'react'
import AOS from 'aos'
import { CacheProvider } from '@emotion/react'
import { CssBaseline, StyledEngineProvider, ThemeProvider } from '@mui/material'
import theme from '@import/theme'
import createEmotionCache from '@import/createEmotionCache'
import { ToastContainer, Zoom } from 'react-toastify'
import { AppProps } from '@import/interface'
import { Analytics } from '@vercel/analytics/react'

const App = ({ Component, emotionCache = createEmotionCache(), pageProps }: AppProps) => {
	useEffect(() => {
		AOS.init({
			offset: 100,
			duration: 1000,
			once: false,
			mirror: true,
		})
	}, [])

	return (
		<StyledEngineProvider injectFirst>
			<CacheProvider value={emotionCache}>
				<ThemeProvider theme={theme}>
					<CssBaseline enableColorScheme={true}>
						<ToastContainer
							theme='dark'
							position='top-center'
							transition={Zoom}
						/>
						<Component {...pageProps} />
						<Analytics />
					</CssBaseline>
				</ThemeProvider>
			</CacheProvider>
		</StyledEngineProvider>
	)
}

export default App
