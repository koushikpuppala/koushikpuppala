import { HiHome, HiUser, HiDocument, HiEnvelopeOpen, HiBriefcase, HiFolder } from 'react-icons/hi2'

export const NavbarData = [
	{ name: 'Home', href: '/', icon: HiHome },
	{ name: 'About', href: '/about', icon: HiUser },
	{ name: 'Experience', href: '/experience', icon: HiBriefcase },
	{ name: 'Projects', href: '/projects', icon: HiFolder },
	{ name: 'Resume', href: '/resume', icon: HiDocument },
	{ name: 'Contact', href: '/contact', icon: HiEnvelopeOpen },
]

export const transition = (direction: 'up' | 'down' | 'left' | 'right', delay: number) => ({
	hidden: {
		y: direction === 'up' ? 80 : direction === 'down' ? -80 : 0,
		opacity: 0,
		x: direction === 'left' ? 80 : direction === 'right' ? -80 : 0,
		transition: {
			type: 'tween',
			duration: 1.5,
			delay: delay,
			ease: [0.25, 0.6, 0.3, 0.8],
		},
	},
	show: {
		y: 0,
		x: 0,
		opacity: 1,
		transition: {
			type: 'tween',
			duration: 1.4,
			delay: delay,
			ease: [0.25, 0.25, 0.25, 0.75],
		},
	},
})

export const readableDateTime = (date: string | number | Date) =>
	new Date(date).toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
		weekday: 'long',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		fractionalSecondDigits: 3,
		timeZoneName: 'longGeneric',
	})

export const readableDate = (date: string | number | Date) =>
	new Date(date).toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	})

export const readableTime = (date: string | number | Date) =>
	new Date(date).toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		fractionalSecondDigits: 3,
		timeZoneName: 'short',
	})

export const monthYear = (date: string | number | Date) =>
	new Date(date).toLocaleDateString('en-US', {
		month: 'short',
		year: 'numeric',
	})

export const ISODate = (date: string | number | Date) => new Date(date).toISOString()
