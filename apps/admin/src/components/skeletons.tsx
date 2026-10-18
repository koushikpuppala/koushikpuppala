import type {
	FieldRowLayout,
	FieldSkeletonProps,
	FormFieldsSkeletonProps,
	LabelledProps,
	ListSkeletonProps,
	PageHeaderSkeletonProps,
	SingletonFieldLayout,
	SingletonFormSkeletonProps,
	SingletonLayout,
	SingletonSkeletonProps,
	StatCardsSkeletonProps,
	TableSkeletonProps,
} from 'types/components/admin'

import { classNames } from 'utils/classNames'
import { LoadingRegion, Skeleton, SkeletonText } from 'ui/skeleton'

const CARD = 'border-border bg-surface rounded-2xl border shadow-xs'

const keys = (count: number, prefix: string) =>
	Array.from({ length: count }, (_, i) => `${prefix}-${i}`)

const PageHeaderSkeleton = ({ actions = 1 }: PageHeaderSkeletonProps) => {
	return (
		<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
			<div className='space-y-2.5'>
				<Skeleton className='h-7 w-60' />
				<Skeleton className='h-4 w-96 max-w-full' />
			</div>
			{actions ? (
				<div className='flex gap-2'>
					{keys(actions, 'action').map(key => (
						<Skeleton key={key} className='h-9 w-28 rounded-lg' />
					))}
				</div>
			) : null}
		</div>
	)
}

const StatCardsSkeleton = ({
	count = 4,
	className = 'grid-cols-2 sm:grid-cols-4',
}: StatCardsSkeletonProps) => {
	return (
		<div className={classNames('grid gap-4', className)}>
			{keys(count, 'stat').map(key => (
				<div key={key} className={classNames(CARD, 'space-y-3 p-5')}>
					<Skeleton className='h-3 w-24' />
					<Skeleton className='h-8 w-14' />
				</div>
			))}
		</div>
	)
}

export const StatValueSkeleton = () => <Skeleton className='my-0.5 h-8 w-14' />

const TableSkeleton = ({ rows = 6, columns = 4, filters = 1 }: TableSkeletonProps) => {
	return (
		<div className='space-y-4'>
			<div className='flex items-center justify-between gap-2'>
				<div className='flex flex-wrap gap-2'>
					<Skeleton className='h-9.5 w-64 rounded-lg' />
					{keys(filters, 'filter').map(key => (
						<Skeleton key={key} className='h-9.5 w-40 rounded-lg' />
					))}
				</div>
				<div className='flex gap-2'>
					<Skeleton className='h-9.5 w-32 rounded-lg' />
					<Skeleton className='size-9.5 rounded-lg' />
				</div>
			</div>
			<div className='border-border bg-surface overflow-hidden rounded-lg border'>
				<div className='bg-signal/10 flex h-11 items-center gap-6 px-3'>
					{keys(columns, 'head').map(key => (
						<Skeleton key={key} className='h-3.5 flex-1' />
					))}
				</div>
				{keys(rows, 'row').map(key => (
					<div
						key={key}
						className='border-border/70 even:bg-surface-strong/40 flex items-center gap-6 border-t px-3 py-3'>
						{keys(columns, `${key}-cell`).map(cell => (
							<Skeleton key={cell} className='h-6 flex-1 rounded-sm' />
						))}
					</div>
				))}
			</div>
			<div className='flex items-center justify-between'>
				<Skeleton className='h-4 w-44' />
				<div className='flex gap-2'>
					<Skeleton className='h-9.5 w-28 rounded-lg' />
					<Skeleton className='h-9.5 w-24 rounded-lg' />
				</div>
			</div>
		</div>
	)
}

const Field = ({ tall = false }: FieldSkeletonProps) => (
	<div className='space-y-2'>
		<Skeleton className='h-3 w-28' />
		<Skeleton className={classNames('w-full rounded-lg', tall ? 'h-24' : 'h-9.5')} />
	</div>
)

export const FormFieldsSkeleton = ({ rows }: FormFieldsSkeletonProps) => {
	return (
		<div className='space-y-6'>
			{rows.map((row, i) =>
				row === 'tall' ? (
					<Field key={`tall-${i}`} tall />
				) : (
					<div
						key={`row-${i}`}
						className={classNames(
							'grid gap-6',
							row === 2 && 'sm:grid-cols-2',
							row === 3 && 'sm:grid-cols-3',
							row === 4 && 'sm:grid-cols-2 lg:grid-cols-4',
						)}>
						{keys(row, `field-${i}`).map(key => (
							<Field key={key} />
						))}
					</div>
				),
			)}
		</div>
	)
}

const Page = ({ label, children }: LabelledProps) => (
	<LoadingRegion label={label} className='space-y-6'>
		{children}
	</LoadingRegion>
)

export const DashboardSkeleton = () => {
	return (
		<Page label='dashboard'>
			<div className={classNames(CARD, 'space-y-4 p-6')}>
				<Skeleton className='h-3 w-40' />
				<Skeleton className='h-8 w-72 max-w-full' />
				<Skeleton className='h-4 w-96 max-w-full' />
			</div>
			<StatCardsSkeleton className='sm:grid-cols-2 lg:grid-cols-4' />
			<div className='grid gap-6 lg:grid-cols-12'>
				<div className={classNames(CARD, 'space-y-4 p-6 lg:col-span-7')}>
					<Skeleton className='h-5 w-40' />
					{keys(4, 'inquiry').map(key => (
						<div key={key} className='flex items-center justify-between gap-4'>
							<SkeletonText lines={2} className='flex-1' />
							<Skeleton className='h-8 w-20 rounded-lg' />
						</div>
					))}
				</div>
				<div className='space-y-6 lg:col-span-5'>
					<div className={classNames(CARD, 'space-y-3 p-6')}>
						<Skeleton className='h-5 w-48' />
						{keys(3, 'health').map(key => (
							<Skeleton key={key} className='h-4 w-full' />
						))}
					</div>
					<div className={classNames(CARD, 'space-y-3 p-6')}>
						<Skeleton className='h-5 w-40' />
						<SkeletonText lines={4} />
					</div>
				</div>
			</div>
		</Page>
	)
}

const SINGLETON_FIELDS = {
	home: [3, [2, 'tall'], 3, 2] as const,
	about: [2, 'tall', 'tall', 4, 2] as const,
	resume: [2, 'tall', 2] as const,
} satisfies Record<SingletonLayout, SingletonFieldLayout>

const flatten = (layout: SingletonLayout): FieldRowLayout[] =>
	(SINGLETON_FIELDS[layout] as SingletonFieldLayout).flat()

export const SingletonFormSkeleton = ({ layout }: SingletonFormSkeletonProps) => (
	<FormFieldsSkeleton rows={flatten(layout)} />
)

export const SingletonSkeleton = ({ layout, label }: SingletonSkeletonProps) => {
	return (
		<Page label={label}>
			<div className='border-border border-b pb-5'>
				<PageHeaderSkeleton actions={3} />
			</div>
			<div className={classNames(CARD, 'p-6 sm:p-8')}>
				<SingletonFormSkeleton layout={layout} />
			</div>
		</Page>
	)
}

export const CollectionSkeleton = ({ label, columns = 4 }: ListSkeletonProps) => {
	return (
		<Page label={label}>
			<PageHeaderSkeleton actions={1} />
			<TableSkeleton columns={columns} />
		</Page>
	)
}

export const MediaGridSkeleton = () => {
	return (
		<div
			className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
			aria-hidden>
			{keys(10, 'tile').map(key => (
				<div key={key} className={classNames(CARD, 'overflow-hidden')}>
					<Skeleton className='aspect-video w-full rounded-none' />
					<div className='space-y-2 p-3'>
						<Skeleton className='h-3 w-4/5' />
						<Skeleton className='h-2.5 w-1/3' />
					</div>
				</div>
			))}
		</div>
	)
}

export const MediaSkeleton = () => {
	return (
		<Page label='media library'>
			<PageHeaderSkeleton actions={1} />
			<div className={classNames(CARD, 'flex items-center justify-between gap-3 p-3')}>
				<Skeleton className='h-9 w-80 max-w-full rounded-lg' />
				<Skeleton className='h-8 w-56 rounded-lg' />
			</div>
			<MediaGridSkeleton />
		</Page>
	)
}

export const InboxSkeleton = ({ label, columns = 5 }: ListSkeletonProps) => {
	return (
		<Page label={label}>
			<PageHeaderSkeleton actions={1} />
			<StatCardsSkeleton />
			<TableSkeleton columns={columns} filters={2} />
		</Page>
	)
}

export const ApiMetricsSkeleton = () => {
	return (
		<Page label='API telemetry'>
			<PageHeaderSkeleton actions={2} />
			<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
				{keys(4, 'health').map(key => (
					<div key={key} className={classNames(CARD, 'flex items-center gap-4 p-5')}>
						<Skeleton className='size-11 shrink-0 rounded-xl' />
						<div className='flex-1 space-y-2'>
							<Skeleton className='h-3 w-20' />
							<Skeleton className='h-5 w-24' />
						</div>
					</div>
				))}
			</div>
			<StatCardsSkeleton count={5} className='grid-cols-2 sm:grid-cols-5' />
			<TableSkeleton columns={6} />
		</Page>
	)
}

export const SettingsSkeleton = () => {
	return (
		<Page label='site settings'>
			<PageHeaderSkeleton actions={2} />
			<div className='grid gap-6 lg:grid-cols-3'>
				<div className='space-y-6 lg:col-span-2'>
					<div className={classNames(CARD, 'space-y-4 p-6')}>
						<Skeleton className='h-5 w-48' />
						<div className='flex flex-wrap gap-2'>
							{keys(8, 'route').map(key => (
								<Skeleton key={key} className='h-7 w-20 rounded-lg' />
							))}
						</div>
						<Skeleton className='h-9.5 w-full rounded-lg' />
					</div>
					<div className={classNames(CARD, 'p-6')}>
						<FormFieldsSkeleton rows={[1, 'tall', 2]} />
					</div>
					<div className={classNames(CARD, 'p-6')}>
						<FormFieldsSkeleton rows={[1]} />
					</div>
				</div>
				<div className='space-y-6'>
					<div className={classNames(CARD, 'space-y-3 p-5')}>
						<Skeleton className='h-3 w-40' />
						<SkeletonText lines={3} />
					</div>
					<div className={classNames(CARD, 'space-y-3 p-5')}>
						<Skeleton className='h-3 w-40' />
						<Skeleton className='aspect-[1200/630] w-full rounded-lg' />
						<SkeletonText lines={2} />
					</div>
				</div>
			</div>
			<TableSkeleton columns={5} filters={0} />
		</Page>
	)
}
