import type { MobileNavProps } from 'types/components/admin'
import { LogoMark } from 'ui/logo'
import { LogOut, X } from 'components/icons'
import { NavLinks } from 'components/shell/nav-links'

export const MobileNav = ({ pathname, onClose, onSignOut }: MobileNavProps) => (
	<div className='fixed inset-0 z-50 lg:hidden'>
		<button
			type='button'
			aria-label='Close mobile navigation'
			className='bg-background/80 fixed inset-0 h-full w-full cursor-default border-0 backdrop-blur-sm'
			onClick={onClose}
		/>
		<aside className='border-border bg-sidebar fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col border-r p-4 shadow-2xl'>
			<div className='border-border flex shrink-0 items-center justify-between border-b pb-4'>
				<div className='flex items-center gap-2'>
					<LogoMark className='size-7 rounded-lg' />
					<span className='font-display text-sm font-bold'>Content Studio</span>
				</div>
				<button
					type='button'
					aria-label='Close navigation'
					onClick={onClose}
					className='text-muted-foreground hover:bg-accent rounded-lg p-1'>
					<X className='size-5' />
				</button>
			</div>

			<NavLinks pathname={pathname} variant='drawer' onNavigate={onClose} />

			<div className='border-border shrink-0 border-t pt-3'>
				<button
					type='button'
					onClick={onSignOut}
					className='text-destructive hover:bg-destructive/10 flex w-full cursor-pointer items-center gap-2 rounded-xl p-2 text-xs'>
					<LogOut className='size-4' />
					<span>Sign out</span>
				</button>
			</div>
		</aside>
	</div>
)
