import { SocialMediaLogoComponentProps } from '@import/types'
import {
	FaLinkedinIn,
	FaGithub,
	FaDiscord,
	FaSkype,
	FaTwitter,
	FaInstagram,
	FaFacebook,
	FaYoutube,
	FaServer,
} from 'react-icons/fa6'

const SocialMediaLogoComponent = ({ platform, className }: SocialMediaLogoComponentProps) => {
	switch (platform) {
		case 'linkedin':
			return <FaLinkedinIn className={className} />
		case 'github':
			return <FaGithub className={className} />
		case 'discord':
			return <FaDiscord className={className} />
		case 'skype':
			return <FaSkype className={className} />
		case 'twitter':
			return <FaTwitter className={className} />
		case 'instagram':
			return <FaInstagram className={className} />
		case 'facebook':
			return <FaFacebook className={className} />
		case 'youtube':
			return <FaYoutube className={className} />
		case 'server':
			return <FaServer className={className} />
		default:
			return null
	}
}

export default SocialMediaLogoComponent
