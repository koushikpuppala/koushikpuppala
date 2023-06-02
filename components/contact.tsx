import { SendOutlined } from '@mui/icons-material'
import { Alert, AlertTitle, Button, TextField, Typography } from '@mui/material'
import Link from 'next/link'
import { Box } from '@mui/system'
import axios from 'axios'
import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const Contact = () => {
	const [values, setValues] = useState({
		form: {
			name: '',
			email: '',
			subject: '',
			message: '',
		},
		errors: {
			name: '',
			email: '',
			subject: '',
			message: '',
		},
	})

	const [isOnline, setIsOnline] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isError, setIsError] = useState(true)
	const RegularExpression = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/)

	useEffect(() => {
		navigator.onLine ? setIsOnline(true) : setIsOnline(false)
		setIsError(
			values.errors.name.length !== 0 ||
				values.errors.email.length !== 0 ||
				values.errors.subject.length !== 0 ||
				values.errors.message.length !== 0 ||
				values.form.name.length === 0 ||
				values.form.email.length === 0 ||
				values.form.subject.length === 0 ||
				values.form.message.length === 0
		)
	}, [values])

	const inputStyle = {
		width: '100%',
		color: 'white',
		'& .MuiOutlinedInput-root': {
			color: 'white',
			'& fieldset': {
				borderColor: 'rgba(255, 255, 255, 0.11)',
			},
			'&:hover fieldset': {
				borderColor: 'rgba(255, 255, 255, 0.11)',
			},
			'&.Mui-focused fieldset': {
				borderColor: 'rgba(255, 255, 255, 0.11)',
			},
		},
		'& .MuiFormLabel-root': {
			color: 'white',
			'&.Mui-focused': {
				color: 'white',
			},
			'& .MuiFormLabel-asterisk': {
				color: 'red',
			},
		},
	}
	const errorInputStyle = {
		width: '100%',
		color: 'white',
		'& .MuiOutlinedInput-root': {
			color: 'white',
		},
	}

	const submitButtonStyle = {
		background: 'transparent',
		padding: '10px 30px',
		color: '#18d26e',
		border: '#18d26e 1px solid',
		borderRadius: '4px',
		fontWeight: '600',
		'&:hover': {
			background: 'transparent',
			border: '#18d26e 1px solid',
		},
		'&:disabled': {
			opacity: '0.5',
			border: '#D5D5D5 1px solid',
			color: '#D5D5D5',
		},
	}

	const clearForm = () => {
		setValues({
			form: {
				name: '',
				email: '',
				subject: '',
				message: '',
			},
			errors: {
				name: '',
				email: '',
				subject: '',
				message: '',
			},
		})
	}

	const handleSubmit = (event: SyntheticEvent) => {
		event.preventDefault()
		setIsSubmitting(true)
		axios
			.post('/api/contact', values.form)
			.then(res => {
				setIsSubmitting(false)
				toast.success(res.data.message)
				clearForm()
			})
			.catch(err => {
				setIsSubmitting(false)
				toast.error(err.response.data.message, {
					autoClose: false,
				})
			})
	}

	const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { id, value } = event.target
		switch (id) {
			case 'name':
				setValues({
					...values,
					form: {
						...values.form,
						name: value,
					},
					errors: {
						...values.errors,
						name:
							value.length > 0 && value.length < 5
								? 'Name must be at least 5 characters'
								: '',
					},
				})
				break
			case 'email':
				setValues({
					...values,
					form: {
						...values.form,
						email: value,
					},
					errors: {
						...values.errors,
						email:
							value.length !== 0 && !RegularExpression.test(value)
								? 'Invalid email address'
								: '',
					},
				})
				break
			case 'subject':
				setValues({
					...values,
					form: {
						...values.form,
						subject: value,
					},
					errors: {
						...values.errors,
						subject:
							value.length > 0 && value.length < 20
								? 'Subject must be at least 20 characters'
								: '',
					},
				})
				break
			case 'message':
				setValues({
					...values,
					form: {
						...values.form,
						message: value,
					},
					errors: {
						...values.errors,
						message:
							value.length > 0 && value.length < 50
								? 'Message must be at least 50 characters'
								: '',
					},
				})
				break
			default:
				break
		}
	}

	return (
		<>
			<section
				id='contact'
				className='contact'>
				<Box className='container'>
					<Box className='section-title'>
						<Typography variant='h2'>Contact</Typography>
						<Typography>Contact Me</Typography>
					</Box>

					<Box className='row mt-2'>
						<Box className='col-md-6 d-flex align-items-stretch'>
							<Box className='info-box'>
								<i className='bx bxs-share-alt'></i>
								<Typography variant='h3'>Social Profiles</Typography>
								<Box className='social-links'>
									<Link
										href='/linkedin'
										target='_blank'
										rel='noreferrer'
										aria-label='LinkedIn'
										className='bi bi-linkedin'></Link>
									<Link
										href='/github'
										target='_blank'
										rel='noreferrer'
										aria-label='GitHub'
										className='bi bi-github'></Link>
									<Link
										href='/discord'
										target='_blank'
										rel='noreferrer'
										aria-label='Discord'
										className='bi bi-discord'></Link>
									<Link
										href='/instagram'
										target='_blank'
										rel='noreferrer'
										aria-label='Instagram'
										className='bi bi-instagram'></Link>
									<Link
										href='/twitter'
										target='_blank'
										rel='noreferrer'
										aria-label='Twitter'
										className='bi bi-twitter'></Link>
									<Link
										href='/facebook'
										target='_blank'
										rel='noreferrer'
										aria-label='Facebook'
										className='bi bi-facebook'></Link>
								</Box>
							</Box>
						</Box>

						<Box className='col-md-6 mt-4 mt-md-0 d-flex align-items-stretch'>
							<Box className='info-box'>
								<i className='bx bxs-user'></i>
								<Typography variant='h3'>Reach Me</Typography>
								<Typography>
									<Link
										href='mailto:contact@koushikpuppala.com'
										target='_blank'
										rel='noreferrer'>
										Email Me
									</Link>
									{' | '}
									<Link
										href='/skype'
										target='_blank'
										rel='noreferrer'>
										Skype Call
									</Link>
								</Typography>
							</Box>
						</Box>
					</Box>
					<Box className='contact-form mt-4'>
						{isOnline ? (
							<>
								<Box className='row'>
									<Box className='col-md-6'>
										<TextField
											sx={
												values.errors.name.length > 0
													? errorInputStyle
													: inputStyle
											}
											variant='outlined'
											placeholder='Your Name'
											label='Your Name'
											id='name'
											value={values.form.name}
											onChange={handleChange}
											error={values.errors.name.length > 0 ? true : false}
											required={true}
											helperText={values.errors.name}
										/>
									</Box>
									<Box className='col-md-6 mt-3 mt-md-0'>
										<TextField
											sx={
												values.errors.email.length > 0
													? errorInputStyle
													: inputStyle
											}
											variant='outlined'
											placeholder='Your Email'
											label='Your Email'
											id='email'
											value={values.form.email}
											onChange={handleChange}
											error={values.errors.email.length > 0 ? true : false}
											required={true}
											helperText={values.errors.email}
										/>
									</Box>
								</Box>
								<TextField
									sx={
										values.errors.subject.length > 0
											? errorInputStyle
											: inputStyle
									}
									className='mt-3'
									variant='outlined'
									placeholder='Your Subject'
									label='Your Subject'
									id='subject'
									value={values.form.subject}
									onChange={handleChange}
									error={values.errors.subject.length > 0 ? true : false}
									required={true}
									helperText={values.errors.subject}
								/>
								<TextField
									sx={
										values.errors.message.length > 0
											? errorInputStyle
											: inputStyle
									}
									className='mt-3'
									variant='outlined'
									placeholder='Message'
									label='Message'
									id='message'
									value={values.form.message}
									onChange={handleChange}
									error={values.errors.message.length > 0 ? true : false}
									required={true}
									helperText={values.errors.message}
									multiline={true}
									rows={6}
								/>
								<Box className='mt-4'>
									{isSubmitting ? (
										<Box className='loading'>Loading</Box>
									) : (
										<Box className='text-center'>
											<Button
												sx={submitButtonStyle}
												variant='outlined'
												disabled={isError}
												onClick={handleSubmit}
												startIcon={<SendOutlined />}>
												Send Message
											</Button>
										</Box>
									)}
								</Box>
							</>
						) : (
							<Alert
								sx={{
									alignItems: 'center',
								}}
								className='text-danger'
								variant='outlined'
								severity='error'
								color='error'>
								<AlertTitle
									sx={{
										fontSize: '1.2rem',
									}}>
									You are Offline as of now.
								</AlertTitle>
								Please Check your internet connection and come back to send message.
							</Alert>
						)}
					</Box>
				</Box>
			</section>

			<div className='credits'>
				Github ❤️{' '}
				<Link
					href='/github/koushikpuppala'
					target='_blank'
					rel='noopener noreferrer'>
					Source Code
				</Link>
			</div>
		</>
	)
}

export default Contact
