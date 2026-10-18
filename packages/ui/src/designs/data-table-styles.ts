export const CONTROL =
	'border-foreground/10 text-foreground focus-ring:ring-signal/40 rounded-lg border bg-transparent px-3 py-2 text-sm font-medium shadow transition-all outline-none hover:bg-foreground/5 focus-ring:ring-2'

export const PAGER =
	'border-foreground/10 text-foreground focus-ring:ring-signal/40 flex cursor-pointer items-center justify-center gap-1 rounded-lg border bg-transparent px-4 py-2 text-sm font-medium whitespace-nowrap shadow-md transition-all outline-none not-disabled:hover:bg-foreground/5 focus-ring:ring-2 disabled:cursor-not-allowed disabled:opacity-50'

export const PANEL =
	'border-foreground/10 bg-surface z-40 mt-0.5 scrollbar-none rounded-lg border p-1 shadow-2xl outline-none'

export const PANEL_DATE =
	'border-foreground/10 bg-surface-strong z-60 mt-0.5 rounded-lg border p-1 shadow-2xl outline-none'

export const OPTION =
	'group text-foreground flex w-full cursor-pointer items-center rounded-lg px-2 py-1 text-sm capitalize hover:bg-foreground/10'

export const PAGE_SIZES = [10, 25, 50, 100].map(size => ({
	label: String(size),
	value: String(size),
}))

export const ICON = 'text-foreground/80 shrink-0'

export const STICKY_ACTIONS =
	'bg-surface sticky right-0 z-10 group-even/row:bg-[color-mix(in_oklab,var(--surface-strong)_40%,var(--surface))] group-hover/row:bg-[color-mix(in_oklab,var(--signal)_5%,var(--surface))]'

export const SEARCH_ICON =
	'text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2'
