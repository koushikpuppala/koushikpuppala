/** @format */

import React from 'react'
import axios from 'axios'
import '../Stylesheets/Contact.css'

const regularExpression = RegExp(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/)

class Contact extends React.Component {
	constructor() {
		super()
		this.state = {
			Name: '',
			Email: '',
			Subject: '',
			Message: '',
			Error: {
				Name: '',
				Email: '',
				Subject: '',
				Message: '',
			},
		}
	}

	handleChange(event) {
		event.preventDefault()

		const { id, value } = event.target
		const Error = { ...this.state.Error }

		switch (id) {
			case 'Name':
				Error.Name = value.length <= 5 ? 'Name should be 5 characters long' : ''
				break
			case 'Email':
				Error.Email = regularExpression.test(value) ? '' : 'Email is not valid'
				break
			case 'Subject':
				Error.Subject = value.length <= 20 ? 'Subject should 20 characters long' : ''
				break
			case 'Message':
				Error.Message = value.length <= 75 ? 'Message should be 75 characters long' : ''
				break
			default:
				break
		}

		this.setState({
			Error,
			[id]: value,
		})
	}

	handleSubmit = (event) => {
		event.preventDefault()

		if (
			this.state.Name === '' ||
			this.state.Email === '' ||
			this.state.Subject === '' ||
			this.state.Message === ''
		) {
			alert('Please fill all the fields')
		} else if (
			this.state.Error.Name !== '' ||
			this.state.Error.Email !== '' ||
			this.state.Error.Subject !== '' ||
			this.state.Error.Message !== ''
		) {
			alert('Please fill all the fields with valid values')
		} else {
			const details = {
				Name: this.state.Name,
				Email: this.state.Email,
				Subject: this.state.Subject,
				Message: this.state.Message,
			}
			axios
				.post('https://koushikpuppala.puppalakoushik.repl.co/contact', details)
				.then((res) => {
					console.log(res)
					this.handleReset()
					alert('Your message has been submitted👍')
				})
				.catch((err) => {
					console.log(err)
					alert('There are some error in server side please try later')
				})
		}
	}

	handleReset = () => {
		this.setState({
			Name: '',
			Email: '',
			Subject: '',
			Message: '',
			Error: {
				Name: '',
				Email: '',
				Subject: '',
				Message: '',
			},
		})
	}

	handleClose = () => {
		if (
			this.state.Name === '' &&
			this.state.Email === '' &&
			this.state.Subject === '' &&
			this.state.Message === ''
		) {
			this.setState({
				Name: '',
				Email: '',
				Subject: '',
				Message: '',
				Error: {
					Name: '',
					Email: '',
					Subject: '',
					Message: '',
				},
			})
		}
	}
	render() {
		const { Error } = this.state
		return (
			<div>
				<section
					className='contact modal fade'
					id='staticBackdrop'
					data-bs-backdrop='static'
					data-bs-keyboard='false'
					tabIndex='-1'
					aria-labelledby='staticBackdropLabel'>
					<div>
						<div className='modal-dialog'>
							<div className='modal-content'>
								<div className='modal-header'>
									<h5 className='modal-title' id='staticBackdropLabel'>
										Contact Me
									</h5>
								</div>
								{navigator.onLine ? (
									<form
										id='contact-form'
										onSubmit={this.handleSubmit.bind(this)}
										noValidate>
										<div className='modal-body'>
											<div className='row g-2'>
												<div className='col-md'>
													<div className='form-floating'>
														<input
															type='text'
															className={
																Error.Name.length > 0
																	? 'is-invalid form-control'
																	: 'form-control'
															}
															id='Name'
															placeholder='Name'
															onChange={this.handleChange.bind(this)}
															defaultValue={this.state.Name}
															required
														/>
														<label htmlFor='floatingInputGrid'>
															Your Name
														</label>
														{Error.Name.length >= 0 && (
															<span className='invalid-feedback'>
																{Error.Name}
															</span>
														)}
													</div>
												</div>
												<div className='col-md'>
													<div className='form-floating'>
														<input
															type='text'
															className={
																Error.Email.length > 0
																	? 'is-invalid form-control'
																	: 'form-control'
															}
															id='Email'
															placeholder='Email'
															onChange={this.handleChange.bind(this)}
															defaultValue={this.state.Email}
															required
														/>
														<label htmlFor='floatingInputGrid'>
															Your Email
														</label>
														{Error.Email.length >= 0 && (
															<span className='invalid-feedback'>
																{Error.Email}
															</span>
														)}
													</div>
												</div>
												<div className='form-floating'>
													<input
														type='text'
														className={
															Error.Subject.length > 0
																? 'is-invalid form-control'
																: 'form-control'
														}
														id='Subject'
														placeholder='Subject'
														onChange={this.handleChange.bind(this)}
														defaultValue={this.state.Subject}
														required
													/>
													<label htmlFor='floatingInputGrid'>
														Enter Subject
													</label>
													{Error.Subject.length >= 0 && (
														<span className='invalid-feedback'>
															{Error.Subject}
														</span>
													)}
												</div>
												<div className='form-floating'>
													<textarea
														className={
															Error.Message.length > 0
																? 'is-invalid form-control'
																: 'form-control'
														}
														placeholder='Message'
														id='Message'
														onChange={this.handleChange.bind(this)}
														defaultValue={this.state.Message}
														required
														style={{ height: '100px' }}></textarea>
													<label htmlFor='floatingTextarea2'>
														Enter Message
													</label>
													{Error.Message.length >= 0 && (
														<span className='invalid-feedback'>
															{Error.Message}
														</span>
													)}
												</div>
											</div>
										</div>
										<div className='modal-footer'>
											<button
												type='button'
												className='hvr-float-shadow btn btn-outline-secondary'
												data-bs-dismiss='modal'
												onClick={this.handleClose.bind(this)}>
												Close
											</button>
											<button
												className='hvr-float-shadow btn btn-outline-info'
												type='submit'
												data-bs-dismiss='modal'>
												Send Message
											</button>
										</div>
									</form>
								) : (
									<>
										<div className='modal-body'>
											<h3
												style={{
													textAlign: 'center',
													marginTop: '20px',
													marginBottom: '20px',
													color: 'red',
												}}>
												Check your Internet connection to Send Message
											</h3>
										</div>

										<div className='modal-footer'>
											<button
												type='button'
												className='hvr-float-shadow btn btn-outline-secondary'
												data-bs-dismiss='modal'>
												Close
											</button>
										</div>
									</>
								)}
							</div>
						</div>
					</div>
				</section>
			</div>
		)
	}
}

export default Contact
