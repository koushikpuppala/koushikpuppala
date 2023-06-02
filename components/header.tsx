import Head from 'next/head'
import { HeaderProps } from '@import/interface'

const Header = (props: HeaderProps) => {
	const title = props.title || 'Koushik Puppala | Freelancer | Computer Science Engineer'
	const description =
		props.description ||
		'I am a computer science engineer and full-stack developer. I am working on full stack and Discord bot projects.'
	const canonical = `https://koushikpuppala.com${props.canonical}`
	return (
		<Head>
			<meta charSet='utf-8' />
			<meta
				content='text/html; charset=utf-8'
				httpEquiv='Content-Type'
			/>
			<meta
				content='width=device-width, initial-scale=1.0'
				name='viewport'
			/>

			<title>{title}</title>
			<meta
				content={title}
				name='title'
			/>
			<meta
				content={description}
				name='description'
			/>
			<meta
				content='Koushik Puppala, Puppala Koushik, Koushikpuppala, Puppalakoushik'
				name='keywords'
			/>

			<meta
				content='Koushikpuppala'
				name='author'
			/>
			<meta
				content='English'
				name='language'
			/>
			<meta
				content='index, follow'
				name='robots'
			/>
			<meta
				content='1 day'
				name='revisit-after'
			/>

			<link
				href='/icons/favicon.ico'
				rel='shortcut icon'
				type='image/x-icon'
			/>
			<link
				rel='icon'
				type='image/png'
				sizes='32x32'
				href='/icons/favicon-32x32.png'
			/>
			<link
				rel='icon'
				type='image/png'
				sizes='16x16'
				href='/icons/favicon-16x16.png'
			/>
			<link
				href='/icons/apple-touch-icon.png'
				rel='apple-touch-icon'
				sizes='180x180'
			/>
			<meta
				property='og:type'
				content='website'
			/>
			<meta
				property='og:url'
				content={canonical}
			/>
			<meta
				property='og:locale'
				content='en_US'
			/>
			<meta
				property='og:title'
				content={title}
			/>
			<meta
				property='og:site_name'
				content={title}
			/>
			<meta
				property='og:description'
				content={description}
			/>
			<meta
				property='og:image'
				content='https://i.ibb.co/qgGRjzg/Koushikpuppala.gif'
			/>
			<meta
				property='og:image:width'
				content='300'
			/>
			<meta
				property='og:image:height'
				content='300'
			/>

			<meta
				name='twitter:card'
				content='summary_large_image'
			/>
			<meta
				name='twitter:url'
				content={canonical}
			/>
			<meta
				name='twitter:site'
				content='@puppala_koushik'
			/>
			<meta
				name='twitter:creator'
				content='@puppala_koushik'
			/>
			<meta
				name='twitter:title'
				content={title}
			/>
			<meta
				name='twitter:description'
				content={description}
			/>
			<meta
				name='twitter:image'
				content='https://i.ibb.co/qgGRjzg/Koushikpuppala.gif'
			/>
			<meta
				name='twitter:image:alt'
				content={title}
			/>

			<link
				rel='canonical'
				href={canonical}
			/>
		</Head>
	)
}

export default Header
