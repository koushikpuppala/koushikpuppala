import type { NavSection } from 'types/components/admin'

import {
	Activity,
	BookOpen,
	Briefcase,
	FileText,
	FolderKanban,
	Gauge,
	Image as ImageIcon,
	Inbox,
	LayoutDashboard,
	ScrollText,
	Settings,
	Share2,
	Sparkles,
	Users,
	Wrench,
} from 'components/icons'

export const ADMIN_NAV: NavSection[] = [
	{
		group: null,
		items: [{ href: '/', label: 'Dashboard', icon: LayoutDashboard }],
	},
	{
		group: 'Content Management',
		items: [
			{ href: '/content/home', label: 'Home Page', icon: Sparkles },
			{ href: '/content/about', label: 'About Page', icon: FileText },
			{ href: '/content/projects', label: 'Projects & Work', icon: FolderKanban },
			{ href: '/content/experience', label: 'Experience Timeline', icon: Briefcase },
			{ href: '/content/education', label: 'Education & Honors', icon: BookOpen },
			{ href: '/content/services', label: 'Skills (Services)', icon: Wrench },
			{ href: '/content/resume', label: 'Resume Document', icon: ScrollText },
			{ href: '/content/social', label: 'Social Channels', icon: Share2 },
		],
	},
	{
		group: 'Operations',
		items: [
			{ href: '/media', label: 'Media Library', icon: ImageIcon },
			{ href: '/messages', label: 'Inquiries & Messages', icon: Inbox },
			{ href: '/audit-logs', label: 'Audit Logs', icon: Activity },
			{ href: '/api-metrics', label: 'API Telemetry', icon: Gauge },
			{ href: '/users', label: 'Users & Permissions', icon: Users },
		],
	},
	{
		group: 'Configuration',
		items: [{ href: '/settings', label: 'Site Metadata & SEO', icon: Settings }],
	},
]
