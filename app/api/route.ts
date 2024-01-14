import { NextResponse, NextRequest } from 'next/server'
import { createTransport } from 'nodemailer'

export const GET = () => {
	return NextResponse.redirect('/')
}

export const POST = async (request: NextRequest) => {
	const { name, email, subject, message } = await request.json()
	const mailer = createTransport({
		service: 'gmail',
		auth: { user: process.env.USER!, pass: process.env.PASS! },
	})

	try {
		await mailer.sendMail({
			from: `Admin Contact From <me@koushikpuppala.com>`,
			replyTo: `${name} <${email}>`,
			to: 'message@koushikpuppala.com',
			subject: `${name} (${email}) sent you a message`,
			html: `<b>Subject:</b> ${subject}<br /><br /><b>Message:</b> ${message}`,
		})
		return NextResponse.json(
			{
				message: 'Message sent successfully. Please wait for a response. Thank you!',
				error: false,
				data: null,
			},
			{
				status: 200,
			},
		)
	} catch (error) {
		throw (
			new Error('Error in sending the message. Please Try again Later.') &&
			NextResponse.json(
				{
					message: 'Error in sending the message. Please Try again Later.',
					error: true,
					data: null,
				},
				{
					status: 500,
				},
			)
		)
	}
}
