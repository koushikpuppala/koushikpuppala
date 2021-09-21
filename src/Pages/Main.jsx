/** @format */

import React from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import About from '../Components/About'
import Portfolio from '../Components/Portfolio'
import Type from '../Components/Type'
import Skills from '../Components/Skills'
import Contact from '../Components/Contact'
import Technology from '../Components/Technology'
import { MainAction } from '../Actions/Main'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '../Stylesheets/Main.css'
import 'boxicons/css/boxicons.min.css'
import 'aos/dist/aos.css'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

toast.configure()
class Main extends React.Component {
	constructor() {
		super()
		this.state = {
			online: navigator.onLine,
		}
	}
	componentDidMount() {
		MainAction()
		console.log(this.state.online)
		if (this.state.online) {
			toast.success('You are online!')
		} else {
			toast.error('You are offline!', { autoClose: false })
		}
	}
	render() {
		return (
			<div>
				<Navbar />
				<Type />
				<main id='main'>
					<About />
					<Skills />
					<Portfolio />
					<Technology />
					<Contact />
				</main>
				<Footer />
			</div>
		)
	}
}

export default Main
