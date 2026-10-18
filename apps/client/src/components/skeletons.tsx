import type {
	FeaturedRowSkeletonProps,
	PageHeroSkeletonProps,
	PageSkeletonProps,
	ProjectListSkeletonProps,
	RecordRowsSkeletonProps,
	SectionHeaderSkeletonProps,
	SectionSkeletonProps,
	StatStripSkeletonProps,
	TimelineSkeletonProps,
} from 'types/components/client'
import { Suspense } from 'react'

import { classNames } from 'utils/classNames'
import { SiteShell } from 'components/site-shell'
import { LoadingRegion, Skeleton, SkeletonText } from 'ui/skeleton'

const keys = (count: number, prefix: string) =>
	Array.from({ length: count }, (_, i) => `${prefix}-${i}`)

export const PageSkeleton = ({ label, children }: PageSkeletonProps) => {
	const region = <LoadingRegion label={label}>{children}</LoadingRegion>

	return (
		<Suspense fallback={region}>
			<SiteShell>{region}</SiteShell>
		</Suspense>
	)
}

export const PageHeroSkeleton = ({ actions = 2 }: PageHeroSkeletonProps) => {
	return (
		<section className='border-border relative overflow-hidden border-b'>
			<div
				className='grid-fine mask-fade-b pointer-events-none absolute inset-0 opacity-60'
				aria-hidden
			/>
			<div className='container-page relative pt-28 pb-14 sm:pt-32 lg:pt-36 lg:pb-20'>
				<Skeleton className='h-3 w-56' />
				<div className='mt-7 max-w-4xl space-y-3'>
					<Skeleton className='h-12 w-4/5 sm:h-16' />
					<Skeleton className='h-12 w-3/5 sm:h-16' />
				</div>
				<SkeletonText lines={2} className='mt-7 max-w-2xl' lineClassName='h-4' />
				{actions ? (
					<div className='mt-9 flex gap-3'>
						{keys(actions, 'action').map(key => (
							<Skeleton key={key} className='h-11 w-40 rounded-lg' />
						))}
					</div>
				) : null}
			</div>
		</section>
	)
}

export const SectionHeaderSkeleton = ({ withDescription = false }: SectionHeaderSkeletonProps) => {
	return (
		<div>
			<div className='flex items-center gap-4'>
				<Skeleton className='h-3 w-6' />
				<Skeleton className='h-3 w-24' />
				<span className='bg-border h-px flex-1' aria-hidden />
			</div>
			<Skeleton className='mt-7 h-9 w-72 max-w-full sm:h-11' />
			{withDescription ? <Skeleton className='mt-5 h-4 w-96 max-w-full' /> : null}
		</div>
	)
}

export const SectionSkeleton = ({ children, className, header = true }: SectionSkeletonProps) => {
	return (
		<section className={classNames('border-border pt-16 pb-20 lg:pt-20 lg:pb-28', className)}>
			<div className='container-page'>
				{header ? <SectionHeaderSkeleton /> : null}
				<div className={header ? 'mt-12' : undefined}>{children}</div>
			</div>
		</section>
	)
}

export const RecordRowsSkeleton = ({ rows = 3 }: RecordRowsSkeletonProps) => {
	return (
		<div>
			{keys(rows, 'record').map(key => (
				<div
					key={key}
					className='border-border grid gap-1.5 border-t py-6 last:border-b sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] sm:gap-10'>
					<Skeleton className='h-3 w-28' />
					<div className='space-y-2.5'>
						<Skeleton className='h-5 w-72 max-w-full' />
						<Skeleton className='h-3.5 w-48' />
					</div>
				</div>
			))}
		</div>
	)
}

export const TimelineSkeleton = ({ items = 3 }: TimelineSkeletonProps) => {
	return (
		<div className='relative space-y-12 pl-10 sm:pl-16'>
			<span
				className='bg-border absolute top-2 bottom-2 left-[0.72rem] w-px sm:left-[1.47rem]'
				aria-hidden
			/>
			{keys(items, 'role').map(key => (
				<div key={key} className='grid gap-4 sm:grid-cols-[10rem_1fr] sm:gap-10'>
					<div className='space-y-2'>
						<Skeleton className='h-8 w-20' />
						<Skeleton className='h-3 w-32' />
					</div>
					<div className='space-y-3'>
						<Skeleton className='h-6 w-64 max-w-full' />
						<Skeleton className='h-3.5 w-40' />
						<SkeletonText lines={2} className='max-w-2xl' />
						<div className='flex gap-2'>
							{keys(4, `${key}-tag`).map(tag => (
								<Skeleton key={tag} className='h-6 w-16 rounded-full' />
							))}
						</div>
					</div>
				</div>
			))}
		</div>
	)
}

export const FeaturedRowSkeleton = ({ flip = false }: FeaturedRowSkeletonProps) => {
	return (
		<div>
			<Skeleton className='h-3 w-48' />
			<Skeleton className='mt-5 h-10 w-80 max-w-full sm:h-14' />
			<div className='mt-8 grid items-center gap-8 lg:grid-cols-12 lg:gap-12'>
				<Skeleton
					className={classNames(
						'aspect-16/10 w-full rounded-2xl lg:col-span-7 xl:col-span-8',
						flip && 'lg:order-2',
					)}
				/>
				<div className='space-y-4 lg:col-span-5 xl:col-span-4'>
					<SkeletonText lines={3} />
					<div className='flex flex-wrap gap-2'>
						{keys(4, 'tech').map(key => (
							<Skeleton key={key} className='h-6 w-20 rounded-full' />
						))}
					</div>
					<Skeleton className='h-4 w-36' />
				</div>
			</div>
		</div>
	)
}

export const ProjectListSkeleton = ({ rows = 2 }: ProjectListSkeletonProps) => {
	return (
		<div className='border-border border-t'>
			{keys(rows, 'project').map(key => (
				<div key={key} className='border-border flex items-center gap-5 border-b py-6 sm:py-7'>
					<Skeleton className='h-3 w-6' />
					<div className='flex-1 space-y-2.5'>
						<Skeleton className='h-5 w-56 max-w-full' />
						<Skeleton className='h-3.5 w-80 max-w-full' />
					</div>
					<Skeleton className='size-9 rounded-full' />
				</div>
			))}
		</div>
	)
}

export const StackClustersSkeleton = () => {
	return (
		<div className='border-border bg-border grid gap-px overflow-hidden rounded-2xl border lg:grid-cols-[21rem_1fr]'>
			<div className='bg-background flex gap-px overflow-hidden lg:flex-col'>
				{keys(6, 'group').map(key => (
					<div
						key={key}
						className='bg-background flex min-w-52 items-center gap-3 px-5 py-4 lg:py-6'>
						<Skeleton className='h-3 w-6' />
						<Skeleton className='h-4 w-28' />
					</div>
				))}
			</div>
			<div className='bg-surface grid min-h-76 content-start gap-x-6 gap-y-5 p-6 sm:grid-cols-2 sm:p-9'>
				{keys(8, 'item').map(key => (
					<Skeleton key={key} className='h-5 w-3/4' />
				))}
			</div>
		</div>
	)
}

export const TickerSkeleton = () => (
	<div className='border-border bg-surface/40 border-y py-5'>
		<div className='container-page flex gap-8 overflow-hidden'>
			{keys(8, 'tick').map(key => (
				<Skeleton key={key} className='h-3 w-24 shrink-0' />
			))}
		</div>
	</div>
)

export const ContactCTASkeleton = () => {
	return (
		<section className='border-border border-t'>
			<div className='container-page py-20 sm:py-28 lg:py-32'>
				<Skeleton className='h-3 w-16' />
				<div className='mt-6 space-y-3'>
					<Skeleton className='h-10 w-96 max-w-full sm:h-14' />
					<Skeleton className='h-10 w-72 max-w-full sm:h-14' />
				</div>
				<SkeletonText lines={2} className='mt-6 max-w-md' />
				<div className='mt-10 flex gap-3'>
					<Skeleton className='h-12 w-48 rounded-lg' />
					<Skeleton className='h-12 w-36 rounded-lg' />
				</div>
			</div>
		</section>
	)
}

export const AboutBlockSkeleton = () => {
	return (
		<div className='grid gap-12 lg:grid-cols-12 lg:gap-16'>
			<div className='space-y-6 lg:col-span-7'>
				<Skeleton className='h-8 w-4/5' />
				<SkeletonText lines={4} />
				<SkeletonText lines={3} />
			</div>
			<div className='panel overflow-hidden rounded-2xl lg:col-span-5'>
				<Skeleton className='aspect-4/3 w-full rounded-none' />
				<div className='space-y-4 p-6'>
					{keys(4, 'fact').map(key => (
						<div key={key} className='flex justify-between gap-4'>
							<Skeleton className='h-3 w-20' />
							<Skeleton className='h-3.5 w-36' />
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export const StatStripSkeleton = ({ cells = 3 }: StatStripSkeletonProps) => (
	<div className='border-border bg-border grid gap-px border-y sm:grid-cols-3'>
		{keys(cells, 'stat').map(key => (
			<div key={key} className='bg-background space-y-3 px-6 py-7'>
				<Skeleton className='h-3 w-20' />
				<Skeleton className='h-8 w-16' />
			</div>
		))}
	</div>
)

export const LeadershipSkeleton = () => (
	<div className='border-border space-y-4 rounded-2xl border p-7 sm:p-9'>
		<Skeleton className='h-3 w-24' />
		<Skeleton className='h-6 w-96 max-w-full' />
		<Skeleton className='h-3.5 w-56' />
		<SkeletonText lines={2} className='max-w-2xl' />
	</div>
)
