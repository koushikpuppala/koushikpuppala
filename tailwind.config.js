/** @type {import('tailwindcss').Config} */

module.exports = {
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
				'black-100': '#100d25',
				'black-200': '#090325',
				'white-100': '#f3f3f3',
				accent: '#915EFF',
			},
			backgroundImage: {
				site: 'url("/herobg.webp")',
			},
			animation: {
				'spin-slow': 'spin 6s linear infinite',
			},
		},
	},
	plugins: [],
}
