import type { Config } from 'tailwindcss'

const config: Config = {
	content: [
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',

		// Or if using `src` directory:
		'./src/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		container: {
			padding: {
				DEFAULT: '15px',
			},
		},
		screens: {
			xs: '450px',
			sm: '540px',
			md: '768px',
			lg: '960px',
			xl: '1200px',
		},
		extend: {
			colors: {
				primary: '#131424',
				secondary: '#aaa6c3',
				tertiary: '#151030',
				quaternary: '#0a081a',
				accent: '#915EFF',
				'black-100': '#100d25',
				'black-200': '#090325',
				'white-100': '#f3f3f3',
			},
			backgroundImage: {
				site: 'url("/site-bg.webp")',
				'black-gradient': 'linear-gradient(to right, #434343, #000000)',
				'accent-gradient': 'linear-gradient(-90deg, #915EFF 0%, rgba(60, 51, 80, 0) 100%)',
				'violet-gradient': 'linear-gradient(to left, rgba(60, 51, 80, 0) 0%, #804dee 100%)',
				'green-pink-gradient': 'linear-gradient(90.13deg, #00cea8 1.9%, #bf61ff 97.5%)',
			},
			animation: {
				'spin-slow': 'spin 6s linear infinite',
			},
		},
	},
	plugins: [],
}

export default config
