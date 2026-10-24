import type { IconType } from 'react-icons'
import { FaDiscord, FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { LuArrowUpRight, LuGlobe } from 'react-icons/lu'
import { SiGmail } from 'react-icons/si'
import type { PublishedSocial } from 'types/models'

export {
	LuArrowRight as ArrowRight,
	LuArrowLeft as ArrowLeft,
	LuArrowUpRight as ArrowUpRight,
	LuArrowDown as ArrowDown,
	LuExternalLink as ExternalLink,
	LuSearch as Search,
	LuX as X,
	LuChevronDown as ChevronDown,
	LuDownload as Download,
	LuSend as Send,
	LuCircleCheck as CheckCircle2,
	LuGraduationCap as GraduationCap,
	LuCommand as CommandIcon,
	LuSun as Sun,
	LuMoon as Moon,
	LuInbox as Inbox,
	LuRefreshCw as RefreshCw,
	LuCopy as Copy,
	LuCheck as Check,
	LuClock as Clock,
	LuSparkles as Sparkles,
	LuMapPin as MapPin,
	LuZap as Zap,
} from 'react-icons/lu'

export { FaGithub as Github } from 'react-icons/fa'
export { SiGmail as Mail } from 'react-icons/si'

const platformIcons: Record<string, IconType> = {
	LINKEDIN: FaLinkedin,
	GITHUB: FaGithub,
	DISCORD: FaDiscord,
	TWITTER: FaXTwitter,
	X: FaXTwitter,
	INSTAGRAM: FaInstagram,
	FACEBOOK: FaFacebook,
	YOUTUBE: FaYoutube,
	EMAIL: SiGmail,
	GMAIL: SiGmail,
	WEBSITE: LuGlobe,
}

export const socialIcon = ({
	platform,
	icon,
}: Pick<PublishedSocial, 'platform' | 'icon'>): IconType =>
	(icon ? platformIcons[icon.toUpperCase()] : undefined) ??
	platformIcons[platform.toUpperCase()] ??
	LuArrowUpRight
