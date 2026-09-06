import { classNames } from 'utils/classNames'

const Table = ({ className, ...props }: React.ComponentProps<'table'>) => (
	<div data-slot='table-container' className='relative w-full overflow-x-auto'>
		<table
			data-slot='table'
			className={classNames('w-full caption-bottom text-sm', className)}
			{...props}
		/>
	</div>
)

const TableHeader = ({ className, ...props }: React.ComponentProps<'thead'>) => (
	<thead
		data-slot='table-header'
		className={classNames('border-b border-border bg-surface-strong/50 font-mono text-xs uppercase tracking-wider text-muted-foreground', className)}
		{...props}
	/>
)

const TableBody = ({ className, ...props }: React.ComponentProps<'tbody'>) => (
	<tbody
		data-slot='table-body'
		className={classNames('divide-y divide-border font-mono text-xs [&_tr:last-child]:border-0', className)}
		{...props}
	/>
)

const TableFooter = ({ className, ...props }: React.ComponentProps<'tfoot'>) => (
	<tfoot
		data-slot='table-footer'
		className={classNames(
			'bg-surface/50 border-t border-border font-mono text-xs text-muted-foreground [&>tr]:last:border-b-0',
			className,
		)}
		{...props}
	/>
)

const TableRow = ({ className, ...props }: React.ComponentProps<'tr'>) => (
	<tr
		data-slot='table-row'
		className={classNames(
			'border-b border-border/60 transition-colors hover:bg-accent/40 data-[state=selected]:bg-accent/50',
			className,
		)}
		{...props}
	/>
)

const TableHead = ({ className, ...props }: React.ComponentProps<'th'>) => (
	<th
		data-slot='table-head'
		className={classNames(
			'h-10 px-4 py-3 text-left align-middle font-mono text-xs uppercase tracking-wider font-medium text-muted-foreground whitespace-nowrap has-[[role=checkbox]]:pr-0 *:[[role=checkbox]]:translate-y-0.5',
			className,
		)}
		{...props}
	/>
)

const TableCell = ({ className, ...props }: React.ComponentProps<'td'>) => (
	<td
		data-slot='table-cell'
		className={classNames(
			'px-4 py-3 align-middle font-sans text-xs whitespace-nowrap text-foreground has-[[role=checkbox]]:pr-0 *:[[role=checkbox]]:translate-y-0.5',
			className,
		)}
		{...props}
	/>
)

const TableCaption = ({ className, ...props }: React.ComponentProps<'caption'>) => (
	<caption data-slot='table-caption' className={classNames('mt-4 text-sm text-muted-foreground', className)} {...props} />
)

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption }
