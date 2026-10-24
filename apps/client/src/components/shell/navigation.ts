export const navItems = [
	{ href: '/about', label: 'About' },
	{ href: '/experience', label: 'Experience' },
	{ href: '/projects', label: 'Projects' },
	{ href: '/services', label: 'Skills' },
	{ href: '/education', label: 'Education' },
	{ href: '/contact', label: 'Contact' },
] as const

export const allDestinations = [
	{ href: '/', label: 'Home' },
	...navItems,
	{ href: '/resume', label: 'Resume' },
]
