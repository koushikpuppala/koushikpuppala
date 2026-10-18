import type { BootStepProps, StepState, StudioBootProps } from 'types/components/admin'

import { Skeleton } from 'ui/skeleton'
import { classNames } from 'utils/classNames'
import { ADMIN_NAV } from 'constants/navigation'
import { Check, RefreshCw } from 'components/icons'
import { LogoMark } from 'ui/logo'

const Step = ({ state, label }: BootStepProps) => {
	return (
		<li className='flex items-center gap-3'>
			<span
				className={classNames(
					'grid size-6 shrink-0 place-items-center rounded-full border',
					state === 'done' && 'border-success/40 bg-success/15 text-success',
					state === 'active' && 'border-signal/40 bg-signal/10 text-signal-ink',
					state === 'waiting' && 'border-border text-muted-foreground',
				)}
				aria-hidden>
				{state === 'done' ? (
					<Check className='size-3.5' />
				) : state === 'active' ? (
					<RefreshCw className='size-3.5 animate-spin motion-reduce:animate-none' />
				) : (
					<span className='bg-muted-foreground/50 size-1.5 rounded-full' />
				)}
			</span>
			<span
				className={classNames(
					'text-sm',
					state === 'waiting' ? 'text-muted-foreground' : 'text-foreground font-medium',
				)}>
				{label}
			</span>
		</li>
	)
}

export const StudioBoot = ({ stage }: StudioBootProps) => {
	const sessionState: StepState = stage === 'session' ? 'active' : 'done'
	const accessState: StepState =
		stage === 'access' ? 'active' : stage === 'ready' ? 'done' : 'waiting'

	return (
		<div className='bg-background text-foreground relative flex h-screen w-screen overflow-hidden'>
			<aside
				className='border-border bg-sidebar hidden h-full w-64 shrink-0 flex-col border-r lg:flex'
				aria-hidden>
				<div className='border-sidebar-border flex h-16 shrink-0 items-center gap-2.5 border-b px-5'>
					<LogoMark className='size-8 rounded-lg' />
					<div className='space-y-1.5'>
						<Skeleton className='h-3 w-24' />
						<Skeleton className='h-2 w-32' />
					</div>
				</div>
				<div className='space-y-6 px-3 py-4'>
					{ADMIN_NAV.map((section, i) => (
						<div key={section.group ?? `group-${i}`} className='space-y-1'>
							{section.group ? <Skeleton className='mx-3 mb-3 h-2 w-24' /> : null}
							{section.items.map(item => (
								<div key={item.href} className='flex items-center gap-3 px-3 py-2'>
									<Skeleton className='size-4 rounded' />
									<Skeleton className='h-3 w-28' />
								</div>
							))}
						</div>
					))}
				</div>
			</aside>

			<div className='flex h-full min-w-0 flex-1 flex-col' aria-hidden>
				<div className='border-border flex h-16 shrink-0 items-center justify-between border-b px-4 sm:px-6'>
					<Skeleton className='h-3 w-48' />
					<div className='flex items-center gap-2'>
						<Skeleton className='hidden h-8 w-40 rounded-full md:block' />
						<Skeleton className='hidden h-8 w-28 rounded-full sm:block' />
						<Skeleton className='size-8 rounded-full' />
					</div>
				</div>

				<div className='mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8'>
					<div className='flex items-start justify-between gap-4'>
						<div className='space-y-2.5'>
							<Skeleton className='h-7 w-56' />
							<Skeleton className='h-4 w-80 max-w-full' />
						</div>
						<Skeleton className='hidden h-9 w-32 rounded-lg sm:block' />
					</div>
					<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
						{['a', 'b', 'c', 'd'].map(key => (
							<Skeleton key={key} className='h-28 rounded-2xl' />
						))}
					</div>
					<Skeleton className='h-72 rounded-2xl' />
				</div>
			</div>

			<div className='bg-background/40 absolute inset-0 grid place-items-center p-4 backdrop-blur-[2px]'>
				<div
					role='status'
					aria-live='polite'
					className='border-border bg-surface w-full max-w-sm space-y-6 rounded-2xl border p-6 shadow-xl'>
					<div className='flex items-center gap-3'>
						<LogoMark className='size-11 rounded-xl shadow-lg' />
						<div>
							<p className='font-display text-foreground text-base font-bold tracking-tight'>
								Content Studio
							</p>
							<p className='text-muted-foreground font-mono text-[0.6875rem]'>
								admin.koushikpuppala.com
							</p>
						</div>
					</div>
					<ol className='space-y-3'>
						<Step
							state={sessionState}
							label={sessionState === 'done' ? 'Session found' : 'Checking your session'}
						/>
						<Step
							state={accessState}
							label={accessState === 'done' ? 'Studio access confirmed' : 'Verifying studio access'}
						/>
					</ol>
				</div>
			</div>
		</div>
	)
}
