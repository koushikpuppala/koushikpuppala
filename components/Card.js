import React from 'react'
import styles from '../stylesheets/components/Card.module.scss'

export default class Card extends React.Component {
	constructor(props) {
		super(props)
		this.props = props
	}

	onClick = (event, url) => {
		event.preventDefault()
		window.open('https://github.koushikpuppala.live', '_blank')
	}

	render() {
		return (
			<>
				<div className={[styles.flip, styles.flip_vertical].join(' ')}>
					<div
						className={styles.front}
						style={{
							backgroundImage: 'url(/images/other/AvengersAssemble.webp)',
						}}>
						<h1 className={styles.text_shadow}>KOUSHIKPUPPALA</h1>
					</div>
					<div className={styles.back}>
						<h2>Angular</h2>
						<p>
							Good tools make application development quicker and easier to maintain
							than if you did everything by hand..
						</p>
						<div className={styles.buttons}>
							<button className={styles.cta} onClick={this.onClick.bind(this)}>
								<span>Website</span>
								<svg width='15px' height='10px' viewBox='0 0 13 10'>
									<path d='M1,5 L11,5'></path>
									<polyline points='8 1 12 5 8 9'></polyline>
								</svg>
							</button>
							&nbsp;&nbsp;
							<button
								onClick={this.onClick.bind(this)}
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
