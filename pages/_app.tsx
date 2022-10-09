import 'bootstrap/dist/css/bootstrap.min.css'
import 'glightbox/dist/css/glightbox.min.css'
import 'boxicons/css/boxicons.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'react-toastify/dist/ReactToastify.css'
import 'remixicon/fonts/remixicon.css'
import 'aos/dist/aos.css'
import '@styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import AOS from 'aos'
import { ThemeProvider } from '@mui/material/styles'
import { CacheProvider, EmotionCache } from '@emotion/react'
import CssBaseline from '@mui/material/CssBaseline'
import theme from '@import/theme'
import createEmotionCache from '@import/createEmotionCache'
import { ToastContainer, Zoom } from 'react-toastify'
import TagManager from 'react-gtm-module'
import ReactGA from 'react-ga'
import { config } from '@import/config'

const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
	emotionCache?: EmotionCache
}

const App = ({ Component, emotionCache = clientSideEmotionCache, pageProps }: MyAppProps) => {
	useEffect(() => {
		AOS.init({
			offset: 100,
			duration: 1000,
			once: false,
			mirror: true,
		})
		if (typeof window !== 'undefined') {
			require('bootstrap/dist/js/bootstrap.bundle.min.js')
		}
		ReactGA.initialize(config.firebaseConfig.measurementId)
		TagManager.initialize({ gtmId: config.firebaseConfig.tagManagerId })
	}, [])

	return (
		<>
			<CacheProvider value={emotionCache}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<ToastContainer
						theme='dark'
						position='top-center'
						transition={Zoom}
					/>
					<Component {...pageProps} />
				</ThemeProvider>
			</CacheProvider>
		</>
	)
}

export default App
