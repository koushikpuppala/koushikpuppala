import 'bootstrap/dist/css/bootstrap.min.css'
import 'glightbox/dist/css/glightbox.min.css'
import 'boxicons/css/boxicons.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'remixicon/fonts/remixicon.css'
import 'aos/dist/aos.css'
import 'swiper/css'
import '../styles/globals.css'
import '../styles/NotFound.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import AOS from 'aos'
import { ToastContainer, toast, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const MyApp = ({ Component, pageProps }: AppProps) => {
	useEffect(() => {
		AOS.init({
			duration: 1000,
			once: false,
			mirror: true,
		})
		window.addEventListener('load', () => {
			console.log(navigator.onLine)
			navigator.onLine
				? toast.success('You are online!')
				: toast.error('You are offline!', {
						autoClose: false,
				  })
		})
	}, [])
	return (
		<>
			<ToastContainer
				theme='dark'
				position='top-center'
				hideProgressBar={false}
				transition={Zoom}
				newestOnTop
				closeOnClick
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
			<Component {...pageProps} />
		</>
	)
}

export default MyApp
