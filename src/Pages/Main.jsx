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

class Main extends React.Component {
	componentDidMount() {
		MainAction()
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
