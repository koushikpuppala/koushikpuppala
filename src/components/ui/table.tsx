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
		className={classNames('border-neutral-100/10 [&_tr]:border-b', className)}
		{...props}
	/>
)

const TableBody = ({ className, ...props }: React.ComponentProps<'tbody'>) => (
	<tbody
		data-slot='table-body'
		className={classNames('[&_tr:last-child]:border-0', className)}
		{...props}
	/>
)

const TableFooter = ({ className, ...props }: React.ComponentProps<'tfoot'>) => (
	<tfoot
		data-slot='table-footer'
		className={classNames(
			'bg-muted/50 border-t border-neutral-100/10 font-medium [&>tr]:last:border-b-0',
			className,
		)}
		{...props}
	/>
)

const TableRow = ({ className, ...props }: React.ComponentProps<'tr'>) => (
	<tr
		data-slot='table-row'
		className={classNames(
			'hover:bg-text-muted/25 data-[state=selected]:bg-text-muted border-b border-neutral-100/10 transition-colors',
			className,
		)}
		{...props}
	/>
)

const TableHead = ({ className, ...props }: React.ComponentProps<'th'>) => (
	<th
		data-slot='table-head'
		className={classNames(
			'text-foreground h-10 border-neutral-100/10 bg-neutral-900 px-2 py-4 text-left align-middle font-semibold whitespace-nowrap not-last:border-r [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
			className,
		)}
		{...props}
	/>
)

const TableCell = ({ className, ...props }: React.ComponentProps<'td'>) => (
	<td
		data-slot='table-cell'
		className={classNames(
			'border-neutral-100/10 px-2 py-2.5 align-middle whitespace-nowrap not-last:border-r [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
			className,
		)}
		{...props}
	/>
)

const TableCaption = ({ className, ...props }: React.ComponentProps<'caption'>) => (
	<caption
		data-slot='table-caption'
		className={classNames('text-muted-foreground mt-4 text-sm', className)}
		{...props}
	/>
)

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption }
