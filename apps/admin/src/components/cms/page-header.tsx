import type { PageHeaderProps } from 'types/components/admin'

export const PageHeader = ({ title, description, children }: PageHeaderProps) => (
	<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
		<div>
			<h1 className='font-display text-foreground text-2xl font-bold tracking-tight'>{title}</h1>
			<p className='text-muted-foreground text-sm'>{description}</p>
		</div>
		{children && <div className='flex items-center gap-2'>{children}</div>}
	</div>
)
