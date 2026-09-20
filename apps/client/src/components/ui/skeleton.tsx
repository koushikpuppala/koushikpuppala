import { classNames } from 'utils/classNames'

const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
	return (
		<div className={classNames('bg-primary/10 animate-pulse rounded-md', className)} {...props} />
	)
}

export { Skeleton }
