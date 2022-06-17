import axios from 'axios'
import type { NextComponentType } from 'next'
import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react'

const Contact: NextComponentType = () => {
	const [form, SetForm] = useState({
		name: '',
		email: '',
		subject: '',
		message: '',
	})
	const [isLoading, SetIsLoading] = useState(false)
	const [errorMsg, SetErrorMsg] = useState({
		name: '',
		email: '',
		subject: '',
		message: '',
	})
	const [isError, SetIsError] = useState('')
	const [successMsg, SetSuccessMsg] = useState('')
	const [isOnline, SetIsOnline] = useState(Boolean)
	const RegularExpression = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/)
	const sendBtn =
		errorMsg.name.length !== 0 ||
		errorMsg.email.length !== 0 ||
		errorMsg.subject.length !== 0 ||
		errorMsg.message.length !== 0 ||
		form.name.length === 0 ||
		form.email.length === 0 ||
		form.subject.length === 0 ||
		form.message.length === 0

	useEffect(() => {
		window.addEventListener('load', () => {
			navigator.onLine ? SetIsOnline(true) : SetIsOnline(false)
		})
	}, [])

	const handleSubmit = (event: SyntheticEvent) => {
		event.preventDefault()
		SetIsLoading(true)
		SetErrorMsg({
			name: '',
			email: '',
			subject: '',
			message: '',
		})
		axios
			.post('/api/contact', form)
			.then(res => {
				SetForm({
					name: '',
					email: '',
					subject: '',
					message: '',
				})
				SetIsLoading(false)
				SetSuccessMsg(res.data.message)
			})
			.catch(err => {
				SetIsLoading(false)
				SetIsError(err.message)
			})

		setTimeout(() => {
			SetSuccessMsg('')
			SetIsError('')
		}, 10000)
	}

	const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = event.target
		switch (name) {
			case 'name':
				SetErrorMsg({
					...errorMsg,
					name:
						value.length > 0 && value.length <= 5
							? 'Name should be 5 characters long'
							: '',
				})
				break
			case 'email':
				SetErrorMsg({
					...errorMsg,
					email:
						value.length === 0 || RegularExpression.test(value)
							? ''
							: 'Email is not valid',
				})
				break
			case 'subject':
				SetErrorMsg({
					...errorMsg,
					subject:
						value.length > 0 && value.length <= 20
							? 'Subject should be 20 characters long'
							: '',
				})
				break
			case 'message':
				SetErrorMsg({
					...errorMsg,
					message:
						value.length > 0 && value.length <= 75
							? 'Message should be 75 characters long'
							: '',
				})
				break
			default:
				break
		}
		SetForm({ ...form, [name]: value })
	}

	return (
		<>
			<section
				id='contact'
				className='contact'>
				<div className='container'>
					<div className='section-title'>
						<h2>Contact</h2>
						<p>Contact Me</p>
					</div>

					<div className='row mt-2'>
						<div className='col-md-6 d-flex align-items-stretch'>
							<div className='info-box'>
								<i className='bx bx-map'></i>
								<h3>My Address</h3>
								<p>Rajahmundry Andhra Pradesh, India</p>
							</div>
						</div>

						<div className='col-md-6 mt-4 mt-md-0 d-flex align-items-stretch'>
							<div className='info-box'>
								<i className='bx bx-share-alt'></i>
								<h3>Social Profiles</h3>
								<div className='social-links'>
									<a
										href='https://www.linkedin.com/in/koushikpuppala'
										target='_blank'
										rel='noreferrer'
										className='linkedin'>
										<i className='bi bi-linkedin'></i>
									</a>
									<a
										href='https://github.com/koushikpuppala'
										target='_blank'
										rel='noreferrer'
										className='github'>
										<i className='bi bi-github'></i>
									</a>
									<a
										href='https://discord.com/channels/@me/735813371433058354'
										target='_blank'
										rel='noreferrer'
										className='discord'>
										<i className='bi bi-discord'></i>
									</a>
									<a
										href='https://www.instagram.com/koushikpuppala'
										target='_blank'
										rel='noreferrer'
										className='instagram'>
										<i className='bi bi-instagram'></i>
									</a>
									<a
										href='https://twitter.com/puppala_koushik'
										target='_blank'
										rel='noreferrer'
										className='twitter'>
										<i className='bi bi-twitter'></i>
									</a>
									<a
										href='https://www.facebook.com/puppalakoushik'
										target='_blank'
										rel='noreferrer'
										className='facebook'>
										<i className='bi bi-facebook'></i>
									</a>
								</div>
							</div>
						</div>

						<div className='col-md-6 mt-4 d-flex align-items-stretch'>
							<div className='info-box'>
								<i className='bx bx-envelope'></i>
								<h3>Email Me</h3>
								<p>
									<a href='mailto:contact@koushikpuppala.com'>
										contact@koushikpuppala.com
									</a>
								</p>
							</div>
						</div>
						<div className='col-md-6 mt-4 d-flex align-items-stretch'>
							<div className='info-box'>
								<i className='bx bx-phone-call'></i>
								<h3>Call Me</h3>
								<p>
									<a
										href='https://join.skype.com/invite/vfWLRyA9iFQc'
										target='_blank'
										rel='noreferrer'>
										Skype Call
									</a>
								</p>
							</div>
						</div>
					</div>
					{isOnline ? (
						<form
							onSubmit={handleSubmit}
							method='post'
							role='form'
							className='contact-form mt-4'>
							<div className='row'>
								<div className='col-md-6 form-group'>
									<div className='form-floating'>
										<input
											type='text'
											name='name'
											className={
												errorMsg.name.length > 0
													? 'is-invalid form-control'
													: 'form-control'
											}
											id='name'
											placeholder='Your Name'
											value={form.name}
											onChange={handleChange}
											required={true}
										/>
										<label htmlFor='name'>
											Your Name <span className='text-danger'>*</span>
										</label>
										{errorMsg.name.length > 0 && (
											<span className='invalid-feedback'>
												{errorMsg.name}
											</span>
										)}
									</div>
								</div>
								<div className='col-md-6 form-group mt-3 mt-md-0'>
									<div className='form-floating'>
										<input
											type='email'
											name='email'
											className={
												errorMsg.email.length > 0
													? 'is-invalid form-control'
													: 'form-control'
											}
											id='email'
											placeholder='Your Email'
											value={form.email}
											onChange={handleChange}
											required={true}
										/>
										<label htmlFor='email'>
											Your Email <span className='text-danger'>*</span>
										</label>
										{errorMsg.email.length > 0 && (
											<span className='invalid-feedback'>
												{errorMsg.email}
											</span>
										)}
									</div>
								</div>
							</div>
							<div className='form-group mt-3'>
								<div className='form-floating'>
									<input
										type='text'
										name='subject'
										className={
											errorMsg.subject.length > 0
												? 'is-invalid form-control'
												: 'form-control'
										}
										id='subject'
										placeholder='Subject'
										value={form.subject}
										onChange={handleChange}
										required={true}
									/>
									<label htmlFor='subject'>
										Subject <span className='text-danger'>*</span>
									</label>
									{errorMsg.subject.length > 0 && (
										<span className='invalid-feedback'>{errorMsg.subject}</span>
									)}
								</div>
							</div>
							<div className='form-group mt-3'>
								<div className='form-floating'>
									<textarea
										name='message'
										className={
											errorMsg.message.length > 0
												? 'is-invalid form-control'
												: 'form-control'
										}
										id='message'
										placeholder='Message'
										value={form.message}
										onChange={handleChange}
										required={true}
										style={{
											height: '200px',
										}}></textarea>
									<label htmlFor='message'>
										Message <span className='text-danger'>*</span>
									</label>
									{errorMsg.message.length > 0 && (
										<span className='invalid-feedback'>{errorMsg.message}</span>
									)}
								</div>
							</div>
							<div className='my-3'>
								{isLoading && <div className='loading'>Loading</div>}
								{isError.length > 0 && (
									<div
										className='alert error-message alert-dismissible fade show'
										role='alert'>
										{isError}
										<button
											type='button'
											className='btn-close'
											data-bs-dismiss='alert'
											aria-label='Close'></button>
									</div>
								)}
								{successMsg.length > 0 && (
									<div
										className='alert success-message alert-dismissible fade show'
										role='alert'>
										{successMsg}
										<button
											type='button'
											className='btn-close'
											data-bs-dismiss='alert'
											aria-label='Close'></button>
									</div>
								)}
							</div>
							<div className='text-center'>
								<button
									type='submit'
									disabled={isLoading || sendBtn}>
									<i className='bi bi-send'></i> Send Message
								</button>
							</div>
						</form>
					) : (
						<div className='contact-form mt-3'>
							<div className='text-center text-danger'>
								<span className='fs-3 fw-bold'>You are Offline as of now.</span>
								<p>Please Check your internet connection and try again.</p>
							</div>
						</div>
					)}
				</div>
			</section>

			<div className='credits'>
				Github ❤️ <a href='https://github.com/koushikpuppala/koushikpuppala'>Source Code</a>
			</div>
		</>
	)
}

export default Contact
