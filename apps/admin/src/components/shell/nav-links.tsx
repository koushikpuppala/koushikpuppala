import type { NavLinksProps } from 'types/components/admin'
import Link from 'next/link'
import { classNames } from 'utils/classNames'
import { isActivePath } from 'lib/navigation'
import { ADMIN_NAV } from 'constants/navigation'

const STYLES = {
	sidebar: {
		nav: 'space-y-6 px-3 py-4',
		group: 'px-3 pb-2',
		link: 'focus-ring:ring-ring focus-ring:ring-2 px-3 outline-none',
	},
	drawer: { nav: 'space-y-5 py-4', group: 'px-2 pb-1', link: 'px-2.5' },
}

export const NavLinks = ({ pathname, variant, onNavigate }: NavLinksProps) => {
	const styles = STYLES[variant]

	return (
		<nav className={classNames('min-h-0 flex-1 scrollbar-none overflow-y-auto', styles.nav)}>
			{ADMIN_NAV.map((section, index) => (
				<div key={section.group ?? `group-${index}`}>
					{section.group && (
						<p
							className={classNames(
								'text-muted-foreground font-mono text-[0.625rem] font-semibold tracking-wider uppercase',
								styles.group,
							)}>
							{section.group}
						</p>
					)}
					<div className='space-y-1'>
						{section.items.map(({ href, label, icon: Icon }) => {
							const active = isActivePath(href, pathname)

							return (
								<Link
									key={href}
									href={href}
									onClick={onNavigate}
									className={classNames(
										'flex items-center gap-2.5 rounded-xl py-2 text-xs font-medium transition-colors',
										styles.link,
										active
											? 'bg-signal/15 text-signal-ink font-semibold'
											: 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground',
									)}>
									<Icon
										className={classNames(
											'size-4 shrink-0',
											active ? 'text-signal-ink' : 'text-muted-foreground',
										)}
									/>
									<span>{label}</span>
								</Link>
							)
						})}
					</div>
				</div>
			))}
		</nav>
	)
}
