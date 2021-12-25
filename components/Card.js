import React from 'react'
import Typed from 'typed.js'
import styles from '../stylesheets/components/Card.module.scss'

export default class Card extends React.Component {
	constructor(props) {
		super(props)
		this.props = props
	}

	componentDidMount() {
		const options = {
			strings: this.props.description,
			typeSpeed: 50,
			backSpeed: 100,
			loop: true,
			cursorChar: ' ',
		}
		// this.el refers to the <span> in the render() method
		this.typed = new Typed(this.el, options)
	}
	componentWillUnmount() {
		// Please don't forget to cleanup animation layer
		this.typed.destroy()
	}

	Website = (event) => {
		event.preventDefault()
		window.open(this.props.website, '_blank')
	}

	LearnMore = (event) => {
		event.preventDefault()
		const url = '/koushikpuppala'
		window.location.href = url
	}

	render() {
		return (
			<>
				<div className={[styles.flip, styles.flip_vertical].join(' ')} key={this.props.id}>
					<div
						className={styles.front}
						style={{
							backgroundImage: `url(${this.props.image})`,
						}}>
						<h1 className={styles.text_shadow}>{this.props.project.toUpperCase()}</h1>
					</div>
					<div className={styles.back}>
						<h2>{this.props.title}</h2>
						<p
							ref={(el) => {
								this.el = el
							}}></p>
						<div className={styles.buttons}>
							<button className={styles.cta} onClick={this.Website.bind(this)}>
								<span>Website</span>
								<svg width='15px' height='10px' viewBox='0 0 13 10'>
									<path d='M1,5 L11,5'></path>
									<polyline points='8 1 12 5 8 9'></polyline>
								</svg>
							</button>
							&nbsp;&nbsp;
							<button
								onClick={this.LearnMore.bind(this)}
								className={[styles.button_learn_more, styles.learn_more].join(' ')}>
								<span aria-hidden='true' className={styles.circle}>
									<span className={[styles.icon, styles.arrow].join(' ')}></span>
								</span>
								<span className={styles.button_text}>Learn More</span>
							</button>
						</div>
					</div>
				</div>
			</>
		)
	}
}
