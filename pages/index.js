import React from 'react'
import Contact from '../components/Contact'
import About from '../components/About'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import Skills from '../components/Skills'
import Header from '../components/Header'
import Portfolio from '../components/Portfolio'
import Technology from '../components/Technology'
export default class Home extends React.Component {
	render() {
		return (
			<>
				<Header title='Home' />
				<div>
					<Navbar />
					<Hero />
					<main id='main'>
						<About />
						<Skills />
						<Portfolio />
						<Technology />
						<Contact />
					</main>
					<Footer />
				</div>
			</>
		)
	}
}
