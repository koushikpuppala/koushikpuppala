import Link from 'next/link'
import { Button } from 'ui/button'
import { Image as ImageIcon, Plus, Sparkles } from 'components/icons'

export const DashboardHero = () => (
	<div className='border-border from-surface to-surface-strong/60 flex flex-col gap-4 rounded-2xl border bg-linear-to-r p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-8'>
		<div>
			<div className='text-signal-ink flex items-center gap-2 font-mono text-xs'>
				<Sparkles className='size-3.5' />
				<span className='font-semibold tracking-wider uppercase'>Administration Console</span>
			</div>
			<h1 className='font-display text-foreground mt-2 text-2xl font-bold tracking-tight sm:text-3xl'>
				Welcome back, Koushik
			</h1>
			<p className='text-muted-foreground mt-1 text-sm'>
				Manage production portfolio content, review visitor inquiries, and audit system mutations.
			</p>
		</div>

		<div className='flex flex-wrap items-center gap-2.5'>
			<Button asChild variant='signal'>
				<Link href='/content/projects'>
					<Plus className='size-4' />
					<span>New Project</span>
				</Link>
			</Button>
			<Button asChild variant='outline'>
				<Link href='/media'>
					<ImageIcon className='size-4' />
					<span>Media S3</span>
				</Link>
			</Button>
		</div>
	</div>
)
