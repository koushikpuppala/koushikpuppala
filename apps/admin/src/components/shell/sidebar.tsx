import type { SidebarProps } from 'types/components/admin'
import Link from 'next/link'
import { LogoMark } from 'ui/logo'
import { NavLinks } from './nav-links'

export const Sidebar = ({ pathname }: SidebarProps) => (
	<aside className='border-border bg-sidebar hidden h-full w-64 shrink-0 flex-col border-r lg:flex'>
		<div className='border-sidebar-border flex h-16 shrink-0 items-center justify-between border-b px-5'>
			<Link href='/' className='group flex items-center gap-2.5'>
				<LogoMark className='size-8 rounded-lg transition-transform group-hover:scale-105' />
				<div>
					<span className='font-display text-foreground block text-sm font-bold tracking-tight'>
						Content Studio
					</span>
					<span className='text-muted-foreground block font-mono text-[0.625rem]'>
						admin.koushikpuppala.com
					</span>
				</div>
			</Link>
		</div>

		<NavLinks pathname={pathname} variant='sidebar' />
	</aside>
)
