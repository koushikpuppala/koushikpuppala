import type { NextComponentType, NextPageContext } from 'next'
import Head from 'next/head'
import { HeaderProps } from '../interface'

const Header: NextComponentType<NextPageContext, HeaderProps, HeaderProps> = (
	props: HeaderProps
) => {
	const title = props.title || 'Koushik Puppala | Freelancer | Computer Science Engineer.'
	const description =
		props.description ||
		'Koushik Puppala is a Freelancer and a Computer Science Engineer. He is currently working as a Full Stack Developer in a USA Company. Created Projects in Full Stack, and Discord Bots.'
	const keywords =
		props.keywords ||
		'Koushik Puppala, Puppala Koushik, Computer Science and Engineer, Freelancer, Full Stack Developer, Discord Bots, Koushikpuppala, Puppalakoushik, IIIT Raichur, IIT Hyderabad, IIITR, IITH'
	const icon = props.icon || '/favicon.ico'
	return (
		<Head>
			<meta charSet='utf-8' />
			<meta content='text/html; charset=utf-8' httpEquiv='Content-Type' />
			<meta content='width=device-width, initial-scale=1.0' name='viewport' />

			<title>{title}</title>
			<meta content={title} name='title' />
			<meta content={description} name='description' />
			<meta content={keywords} name='keywords' />

			<meta content='Koushikpuppala' name='author' />
			<meta content='English' name='language' />
			<meta content='index, follow' name='robots' />
			<meta content='1 day' name='revisit-after' />

			<link href={icon} rel='icon' />
			<link href={icon} rel='shortcut icon' />
			<link href={icon} rel='apple-touch-icon' />

			<meta property='og:type' content='website' />
			<meta property='og:url' content='https://koushikpuppala.com/' />
			<meta property='og:locale' content='en_US' />
			<meta property='og:title' content={title} />
			<meta property='og:site_name' content={title} />
			<meta property='og:description' content={description} />
			<meta property='og:image' content='https://i.ibb.co/qgGRjzg/Koushikpuppala.gif' />
			<meta property='og:image:width' content='300' />
			<meta property='og:image:height' content='300' />

			<meta name='twitter:card' content='summary_large_image' />
			<meta name='twitter:url' content='https://koushikpuppala.com/' />
			<meta name='twitter:site' content='@puppala_koushik' />
			<meta name='twitter:creator' content='@puppala_koushik' />
			<meta name='twitter:title' content={title} />
			<meta name='twitter:description' content={description} />
			<meta name='twitter:image' content='https://i.ibb.co/qgGRjzg/Koushikpuppala.gif' />
			<meta name='twitter:image:alt' content={title} />

			<link rel='canonical' href='https://koushikpuppala.com/' />
		</Head>
	)
}

export default Header
