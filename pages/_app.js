import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'boxicons/css/boxicons.min.css'
import 'aos/dist/aos.css'
import 'swiper/css/bundle'
import '../stylesheets/Global.css'
import '../stylesheets/NotFound.css'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { MainAction } from '../actions/Main'
import ReactGA from 'react-ga'
import TagManager from 'react-gtm-module'

toast.configure()

const tagManagerArgs = {
	gtmId: 'GTM-KSJ6QTV',
}

export default class App extends React.Component {
	componentDidMount() {
		ReactGA.initialize('UA-216125905-1')
		ReactGA.pageview(window.location.pathname + window.location.search)
		TagManager.initialize(tagManagerArgs)
		MainAction()
		if (navigator.onLine) {
			toast.success('You are online!')
		} else {
			toast.error('You are offline!', { autoClose: false })
		}
	}
	constructor(props) {
		super(props)
		this.props = props
	}
	render() {
		return <this.props.Component {...this.props.pageProps} />
	}
}
