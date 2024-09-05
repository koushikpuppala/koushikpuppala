import { HiHome, HiUser, HiDocument, HiEnvelopeOpen, HiBriefcase, HiFolder } from 'react-icons/hi2'

export const NavbarData = [
	{ name: 'Home', href: '/', icon: HiHome },
	{ name: 'About', href: '/about', icon: HiUser },
	{ name: 'Experience', href: '/experience', icon: HiBriefcase },
	{ name: 'Projects', href: '/projects', icon: HiFolder },
	{ name: 'Resume', href: '/resume', icon: HiDocument },
	{ name: 'Contact', href: '/contact', icon: HiEnvelopeOpen },
]

export const FORM_INITIAL_VALUE = { name: '', email: '', subject: '', message: '' }

export const FORM_INITIAL_STATE = { statusCode: 0, statusMessage: '' }

export enum SANITY_DOCUMENT_TYPE {
	HOME = 'home',
	ABOUT = 'about',
	EXPERIENCE = 'experience',
	PROJECT = 'project',
}

export enum SANITY_DOCUMENT_QUERY {
	HOME_DOCUMENT = `*[_type == "${SANITY_DOCUMENT_TYPE.HOME}"][0]`,
	ABOUT_DOCUMENT = `*[_type == "${SANITY_DOCUMENT_TYPE.ABOUT}"][0]`,
	EXPERIENCE_DOCUMENTS = `*[_type == "${SANITY_DOCUMENT_TYPE.EXPERIENCE}"] | order(endDate desc)`,
	PROJECT_DOCUMENTS = `*[_type == "${SANITY_DOCUMENT_TYPE.PROJECT}"] | order(title desc)`,
	RESUME_DOCUMENT = `*[_type == "${SANITY_DOCUMENT_TYPE.ABOUT}"][0].resume`,
}

export const transition = (direction: 'up' | 'down' | 'left' | 'right', delay: number) => ({
	hidden: {
		y: direction === 'up' ? 80 : direction === 'down' ? -80 : 0,
		opacity: 0,
		x: direction === 'left' ? 80 : direction === 'right' ? -80 : 0,
		transition: { type: 'tween', duration: 1.5, delay: delay, ease: [0.25, 0.6, 0.3, 0.8] },
	},
	show: {
		y: 0,
		x: 0,
		opacity: 1,
		transition: { type: 'tween', duration: 1.4, delay: delay, ease: [0.25, 0.25, 0.25, 0.75] },
	},
})

export const monthYear = (date: string | number | Date) =>
	new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

export const ISODate = (date: string | number | Date) => new Date(date).toISOString()

export const notificationTemplate = ({ name, email, subject, message }: Record<string, string>) => `
	<div
		style="
			max-width: 500px;
			margin: 40px auto;
			padding: 20px;
			border: 1px solid #915eff;
			box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
			border-radius: 10px;
			font-family: Arial, sans-serif;
			line-height: 1.6;
			color: #151030;
			mso-border-alt: solid 1px #915eff;
		">
		<img
			src="https://koushikpuppala.com/icons/android-chrome-512x512.png"
			alt="Koushik Puppala"
			style="
				display: block;
				margin: 0 auto 20px;
				max-width: 100px;
				height: auto;
				mso-margin-top-alt: 0;
				mso-margin-bottom-alt: 20px;
			" />
		<h4 style="color: #131424; mso-line-height-rule: exactly; mso-margin-top-alt: 0">Hi Koushik,</h4>
		<p style="color: #151030; mso-line-height-rule: exactly">
			You have received a new message from <strong>${name}</strong> with the following details:
		</p>
		<p style="color: #151030; mso-line-height-rule: exactly"><strong>Name:</strong> ${name}</p>
		<p style="color: #151030; mso-line-height-rule: exactly">
			<strong>Email:</strong>
			<a href="mailto:${email}" style="color: #915eff; text-decoration: none">${email}</a>
		</p>
		<p style="color: #151030; mso-line-height-rule: exactly"><strong>Subject:</strong> ${subject}</p>
		<p style="color: #151030; mso-line-height-rule: exactly"><strong>Message:</strong> ${message}</p>

		<p
			style="
				font-family: Georgia, serif;
				color: #131424;
				line-height: 1.5;
				font-size: 14px;
				mso-line-height-rule: exactly;
				mso-margin-top-alt: 10px;
				mso-margin-bottom-alt: 0;
			">
			<em>------</em><br />
			<strong>Koushik Puppala</strong><br />
			<em style="font-size: 14px">Full-Stack Developer & Software Engineer</em><br />
			<a href="https://koushikpuppala.com" style="color: #915eff; text-decoration: none">
				<strong>koushikpuppala.com</strong>
			</a>
			<br />
			<a href="https://www.linkedin.com/in/koushikpuppala" style="color: #915eff; text-decoration: none">
				LinkedIn
			</a>
			|
			<a href="https://github.com/koushikpuppala" style="color: #915eff; text-decoration: none">GitHub</a>
			<br /><em>------</em>
		</p>

		<hr style="border: none; border-top: 1px solid #ddd; margin: 10px 0; mso-border-top-alt: 1px solid #ddd" />
		<p
			style="
				font-size: 14px;
				color: #aaa6c3;
				text-align: center;
				mso-line-height-rule: exactly;
				mso-text-align: center;
			">
			Note: This is an automated message. Please do not reply to this email.
		</p>
	</div>
`

export const autoReplyTemplate = ({ name, subject }: Record<string, string>) => `
	<div
		style="
			max-width: 500px;
			margin: 40px auto;
			padding: 20px;
			border: 1px solid #915eff;
			box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
			border-radius: 10px;
			font-family: sans-serif;
			line-height: 1.6;
			color: #151030;
			mso-border-alt: solid 1px #915eff;
		">
		<img
			src="https://koushikpuppala.com/icons/android-chrome-512x512.png"
			alt="Koushik Puppala"
			style="
				display: block;
				margin: 0 auto 20px;
				max-width: 100px;
				height: auto;
				mso-margin-top-alt: 0;
				mso-margin-bottom-alt: 20px;
			" />
		<p style="color: #151030; mso-line-height-rule: exactly">Dear ${name},</p>
		<p style="color: #151030; mso-line-height-rule: exactly">Thank you for getting in touch!</p>
		<p style="color: #151030; mso-line-height-rule: exactly">
			I have received your message regarding <strong>${subject}</strong> and will get back to you as soon as
			possible. Your input and inquiries are important to me, and I strive to respond promptly.
		</p>
		<p style="color: #151030; mso-line-height-rule: exactly">
			If your message requires immediate attention, please mention "Urgent" in the subject line next time, and
			I will prioritize it accordingly.
		</p>
		<p style="color: #151030; mso-line-height-rule: exactly">Thank you for your patience.</p>
		<p
			style="
				font-family: Georgia, serif;
				color: #131424;
				line-height: 1.5;
				font-size: 14px;
				mso-line-height-rule: exactly;
				mso-margin-top-alt: 10px;
				mso-margin-bottom-alt: 0;
			">
			<em>------</em><br />
			<strong>Koushik Puppala</strong><br />
			<em style="font-size: 14px">Full-Stack Developer & Software Engineer</em><br />
			<a href="https://koushikpuppala.com" style="color: #915eff; text-decoration: none">
				<strong>koushikpuppala.com</strong>
			</a>
			<br />
			<a href="https://www.linkedin.com/in/koushikpuppala" style="color: #915eff; text-decoration: none">
				LinkedIn
			</a>
			|
			<a href="https://github.com/koushikpuppala" style="color: #915eff; text-decoration: none">GitHub</a>
			<br /><em>------</em>
		</p>

		<hr style="border: none; border-top: 1px solid #ddd; margin: 10px 0; mso-border-top-alt: 1px solid #ddd" />
		<p
			style="
				font-size: 14px;
				color: #aaa6c3;
				text-align: center;
				mso-line-height-rule: exactly;
				mso-text-align: center;
			">
			Note: This is an automated message. Please do not reply to this email.
		</p>
	</div>
`
