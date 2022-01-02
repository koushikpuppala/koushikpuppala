import React from 'react'
import Typed from 'typed.js'

export default class Card extends React.Component {
	constructor(props) {
		super(props)
		this.props = props
		this.aos = ['slide-left', 'slide-right']
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
		window.location.href = `/projects/${this.props.project}`
	}

	render() {
		return (
			<div
				className={`col-lg-6 col-md-12 portfolio-item filter-${this.props.category}`}
				data-aos={this.aos[this.props.aos % 2]}
				key={this.props.id}>
				<div className='flip flip_vertical'>
					<div
						className='front'
						style={{
							backgroundImage: `url(${this.props.image})`,
						}}>
						{/* <h1 className='text_shadow'>{this.props.project.toUpperCase()}</h1> */}
					</div>
					<div className='back'>
						<h2>{this.props.title}</h2>
						<p
							ref={(el) => {
								this.el = el
							}}></p>
						<div className='buttons'>
							<button className='cta' onClick={this.Website.bind(this)}>
								<span>Website</span>
								<svg width='15px' height='10px' viewBox='0 0 13 10'>
									<path d='M1,5 L11,5'></path>
									<polyline points='8 1 12 5 8 9'></polyline>
								</svg>
							</button>
							&nbsp;&nbsp;
							<button
								onClick={this.LearnMore.bind(this)}
								className='button_learn_more learn_more'>
								<span aria-hidden='true' className='circle'>
									<span className='icon arrow'></span>
								</span>
								<span className='button_text'>Learn More</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
