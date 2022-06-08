import type { NextComponentType } from 'next'
import Head from 'next/head'
import { HeaderProps } from '../types'

const Header: NextComponentType = (props: HeaderProps) => {
	const title = props.title || 'Koushik Puppala | Computer Science Engineer'
	const description =
		props.description ||
		'Koushik Puppala is a CSE Student at the Indian Institute of Information Technology, Raichur. Making a few Websites, helping with the IIITR website, and creating a few apps'
	const keywords =
		props.keywords ||
		'Puppala Koushik, PuppalaKoushik, Koushik Puppala, KoushikPuppala, Computer Science and Engineer, IIIT Raichur, IIT Hyderabad, Hyderabad, Rajahmundry, Raichur, IIITR, IITH'
	const icon = props.icon || '/favicon.ico'
	return (
		<Head>
			<meta charSet='utf-8' />
			<meta content='width=device-width, initial-scale=1.0' name='viewport' />

			<title>{title}</title>
			<meta content={description} name='description' />
			<meta content={keywords} name='keywords' />

			<link href={icon} rel='icon' />
			<link href={icon} rel='shortcut icon' />
			<link href={icon} rel='apple-touch-icon' />

			<meta property='og:type' content='website' />
			<meta property='og:locale' content='en_US' />
			<meta property='og:title' content={title} />
			<meta property='og:site_name' content={title} />
			<meta property='og:description' content={description} />
			<meta property='og:image' content='https://i.ibb.co/DkRHkWt/Koushikpuppala.webp' />
			<meta property='og:image:width' content='300' />
			<meta property='og:image:height' content='300' />
			<meta property='og:url' content='https://koushikpuppala.com/' />

			<meta name='twitter:card' content='summary' />
			<meta name='twitter:site' content='@puppala_koushik' />
			<meta name='twitter:creator' content='@puppala_koushik' />
			<meta name='twitter:title' content={title} />
			<meta name='twitter:description' content={description} />
			<meta name='twitter:image' content='https://i.ibb.co/DkRHkWt/Koushikpuppala.webp' />

			<link rel='canonical' href='https://koushikpuppala.com/' />
		</Head>
	)
}

export default Header
