import { ADMIN_NAV } from 'constants/navigation'

export const isActivePath = (href: string, pathname: string): boolean =>
	href === '/' ? pathname === '/' : pathname.startsWith(href)

export const breadcrumbsFor = (pathname: string): string[] => {
	if (pathname === '/') return ['Admin', 'Dashboard']

	for (const section of ADMIN_NAV)
		for (const item of section.items)
			if (item.href !== '/' && pathname.startsWith(item.href))
				return ['Admin', section.group || 'Overview', item.label]

	return ['Admin', 'Content Studio']
}
