import { BackendImage, FrontendImage, FullStackImage, OpenSourceImage } from '@import/images'
import { FaLinkedinIn, FaGithub, FaDiscord, FaInstagram, FaXTwitter, FaFacebookF } from 'react-icons/fa6'
import { HiHome, HiUser, HiDocument, HiEnvelopeOpen, HiBriefcase } from 'react-icons/hi2'

export const SocialMedia = [
	{ name: 'Linkedin', href: '/linkedin', icon: FaLinkedinIn },
	{ name: 'GitHub', href: '/github', icon: FaGithub },
	{ name: 'Discord', href: '/discord', icon: FaDiscord },
	{ name: 'Instagram', href: '/instagram', icon: FaInstagram },
	{ name: 'Twitter', href: '/twitter', icon: FaXTwitter },
	{ name: 'Facebook', href: '/facebook', icon: FaFacebookF },
]

export const NavbarData = [
	{ name: 'Home', href: '/', icon: HiHome },
	{ name: 'About', href: '/about', icon: HiUser },
	{ name: 'Resume', href: '/resume', icon: HiDocument },
	{ name: 'Portfolio', href: '/portfolio', icon: HiBriefcase },
	{ name: 'Contact', href: '/contact', icon: HiEnvelopeOpen },
]

export const ServicesData = [
	{
		title: 'Full Stack Developer',
		icon: FullStackImage,
	},
	{
		title: 'Open Source Contributor',
		icon: OpenSourceImage,
	},
	{
		title: 'Frontend Developer',
		icon: FrontendImage,
	},
	{
		title: 'Backend Developer',
		icon: BackendImage,
	},
]
