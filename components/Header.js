import Head from 'next/head'
import React from 'react'

export default class Header extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			title: props.title ? props.title : 'Koushik Puppala | CSE | Freelancer',
			description: props.description
				? props.description
				: 'Koushik Puppala is Studying Computer Science and Engineering at the Indian Institute of Information Technology, Raichur. I am working on Full Stack Development, Discord Bots Projects, and started working on Android App Development.',
			canonical: props.canonical ? props.canonical : '/',
			url: 'https://koushikpuppala.live',
		}
	}

	render() {
		return (
			<Head>
				<meta charSet='UTF-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />
				<meta name='theme-color' content='rgb(6, 209, 224)' />
				<meta name='msapplication-TileColor' content='rgb(6, 209, 224)' />
				<meta name='msapplication-TileImage' content='/icons/ms-icon-144x144.png' />

				{/* Website Main Information */}
				<title>{this.state.title}</title>
				<meta name='description' content={this.state.description} />
				<meta
					name='keywords'
					content='Koushik, Puppala, Puppala Koushik, PuppalaKoushik, Koushik Puppala, KoushikPuppala, Computer Science and Engineer, IIIT Raichur ,IIT Hyderabad , Hyderabad, Rajahmundry, Raichur, IIITR, IITH, Tirumala'
				/>

				{/* Favicon Information */}
				<link rel='apple-touch-icon' sizes='57x57' href='/icons/apple-icon-57x57.png' />
				<link rel='apple-touch-icon' sizes='60x60' href='/icons/apple-icon-60x60.png' />
				<link rel='apple-touch-icon' sizes='72x72' href='/icons/apple-icon-72x72.png' />
				<link rel='apple-touch-icon' sizes='76x76' href='/icons/apple-icon-76x76.png' />
				<link rel='apple-touch-icon' sizes='114x114' href='/icons/apple-icon-114x114.png' />
				<link rel='apple-touch-icon' sizes='120x120' href='/icons/apple-icon-120x120.png' />
				<link rel='apple-touch-icon' sizes='144x144' href='/icons/apple-icon-144x144.png' />
				<link rel='apple-touch-icon' sizes='152x152' href='/icons/apple-icon-152x152.png' />
				<link rel='apple-touch-icon' sizes='180x180' href='/icons/apple-icon-180x180.png' />
				<link rel='icon' type='image/png' sizes='16x16' href='/icons/favicon-16x16.png' />
				<link rel='icon' type='image/png' sizes='32x32' href='/icons/favicon-32x32.png' />
				<link rel='icon' type='image/png' sizes='96x96' href='/icons/favicon-96x96.png' />
				<link
					rel='icon'
					type='image/png'
					sizes='192x192'
					href='/icons/android-icon-192x192.png'
				/>

				{/* Canonical and Manifest Information */}
				<link rel='canonical' href={`${this.state.url}${this.state.canonical}`} />
				<link rel='manifest' href='/main.webmanifest' />

				{/* Search Engine Card Information */}
				<meta property='og:type' content='website' />
				<meta property='og:locale' content='en_US' />
				<meta property='og:title' content={this.state.title} />
				<meta property='og:site_name' content={this.state.title} />
				<meta property='og:description' content={this.state.description} />
				<meta property='og:image' content='/icons/android-icon-192x192.png' />
				<meta property='og:image:width' content='300' />
				<meta property='og:image:height' content='300' />
				<meta property='og:url' content={`${this.state.url}${this.state.canonical}`} />

				{/* Twitter Card Information */}
				<meta name='twitter:card' content='summary' />
				<meta name='twitter:site' content='@puppala_koushik' />
				<meta name='twitter:creator' content='@puppala_koushik' />
				<meta name='twitter:title' content={this.state.title} />
				<meta name='twitter:description' content={this.state.description} />
				<meta name='twitter:image' content='/icons/android-icon-192x192.png' />
				<script
					src='https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js'
					integrity='sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p'
					crossOrigin='anonymous'></script>
				{/* Global site tag (gtag.js) - Google Analytics  */}
				{/* <script
					async
					src='https://www.googletagmanager.com/gtag/js?id=G-B63896E1RK'></script>
				<script
					async
					dangerouslySetInnerHTML={{
						__html: `window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', 'G-B63896E1RK');`,
					}}
				/> */}
			</Head>
		)
	}
}
