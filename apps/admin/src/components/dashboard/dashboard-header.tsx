import type { DashboardHeaderProps } from 'types/components/admin'
import Link from 'next/link'
import { Button } from 'ui/button'
import { classNames } from 'utils/classNames'
import { Image as ImageIcon, Plus, RefreshCw, Sparkles } from 'components/icons'

export const DashboardHeader = ({
	displayName,
	email,
	refreshing,
	onRefresh,
	children,
}: DashboardHeaderProps) => {
	const firstName = displayName && displayName !== email ? displayName.split(/\s+/)[0] : null

	return (
		<header className='border-border from-surface to-surface-strong/60 rounded-lg border bg-linear-to-r p-6 sm:p-8'>
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<div className='text-signal-ink text-caption flex items-center gap-2'>
						<Sparkles aria-hidden className='size-3.5' />
						<span className='font-semibold tracking-wider uppercase'>Administration console</span>
					</div>
					<h1 className='text-headline text-foreground mt-2 font-bold'>
						{firstName ? `Welcome back, ${firstName}` : 'Welcome back'}
					</h1>
					<p className='text-body text-muted-foreground mt-1'>
						Manage production portfolio content, review visitor inquiries, and audit system
						mutations.
					</p>
				</div>

				<div className='flex flex-wrap items-center gap-2'>
					<Button asChild variant='signal'>
						<Link href='/content/projects'>
							<Plus aria-hidden />
							New project
						</Link>
					</Button>
					<Button asChild variant='outline'>
						<Link href='/media'>
							<ImageIcon aria-hidden />
							Media
						</Link>
					</Button>
					<Button type='button' variant='outline' disabled={refreshing} onClick={onRefresh}>
						<RefreshCw aria-hidden className={classNames(refreshing && 'animate-spin')} />
						Refresh
					</Button>
				</div>
			</div>
			{children}
		</header>
	)
}
