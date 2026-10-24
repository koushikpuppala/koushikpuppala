import type { ComponentProps } from 'react'
import { classNames } from 'utils/classNames'

const Table = ({ className, ...props }: ComponentProps<'table'>) => (
	<div data-slot='table-container' className='relative w-full overflow-x-auto'>
		<table
			data-slot='table'
			className={classNames('w-full caption-bottom text-sm', className)}
			{...props}
		/>
	</div>
)

const TableHeader = ({ className, ...props }: ComponentProps<'thead'>) => (
	<thead data-slot='table-header' className={classNames('text-foreground', className)} {...props} />
)

const TableBody = ({ className, ...props }: ComponentProps<'tbody'>) => (
	<tbody
		data-slot='table-body'
		className={classNames('text-sm [&_tr:last-child]:border-0', className)}
		{...props}
	/>
)

const TableRow = ({ className, ...props }: ComponentProps<'tr'>) => (
	<tr
		data-slot='table-row'
		className={classNames(
			'border-border/70 hover:bg-signal/5 data-[state=selected]:bg-signal/10 border-b transition-colors',
			className,
		)}
		{...props}
	/>
)

const TableHead = ({ className, ...props }: ComponentProps<'th'>) => (
	<th
		data-slot='table-head'
		className={classNames(
			'text-foreground h-11 bg-[color-mix(in_oklab,var(--signal)_10%,var(--surface))] px-3 py-2.5 text-left align-middle font-semibold whitespace-nowrap first:rounded-tl-lg last:rounded-tr-lg has-[[role=checkbox]]:pr-0 *:[[role=checkbox]]:translate-y-0.5',
			className,
		)}
		{...props}
	/>
)

const TableCell = ({ className, ...props }: ComponentProps<'td'>) => (
	<td
		data-slot='table-cell'
		className={classNames(
			'text-foreground px-3 py-2.5 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0 *:[[role=checkbox]]:translate-y-0.5',
			className,
		)}
		{...props}
	/>
)

export { Table, TableHeader, TableBody, TableHead, TableRow, TableCell }
