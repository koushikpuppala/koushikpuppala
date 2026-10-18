import type { LoadingRegionProps, SkeletonProps, SkeletonTextProps } from 'types/components'
import { classNames } from 'utils/classNames'

export const Skeleton = ({ className }: SkeletonProps) => {
	return <div aria-hidden className={classNames('skeleton rounded-md', className)} />
}

export const SkeletonText = ({ lines = 3, className, lineClassName }: SkeletonTextProps) => {
	const widths = ['w-full', 'w-11/12', 'w-4/5', 'w-2/3', 'w-1/2']
	const bars = Array.from({ length: lines }, (_, i) => ({
		key: `line-${i}`,
		width: i === lines - 1 && lines > 1 ? 'w-3/5' : widths[i % widths.length],
	}))

	return (
		<div aria-hidden className={classNames('space-y-2.5', className)}>
			{bars.map(bar => (
				<Skeleton key={bar.key} className={classNames('h-3.5', bar.width, lineClassName)} />
			))}
		</div>
	)
}

export const LoadingRegion = ({ label, children, className }: LoadingRegionProps) => {
	return (
		<div role='status' aria-busy='true' aria-live='polite' className={className}>
			<span className='sr-only'>Loading {label}</span>
			{children}
		</div>
	)
}
