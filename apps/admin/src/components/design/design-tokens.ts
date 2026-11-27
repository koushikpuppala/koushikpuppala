import type {
	DesignControlStep,
	DesignRadiusStep,
	DesignRow,
	DesignSwatch,
	DesignTextStep,
} from 'types/components/admin'

// Class names are written out in full so Tailwind finds them in the source.
export const SWATCHES: DesignSwatch[] = [
	{ name: 'background', swatchClassName: 'bg-background' },
	{ name: 'surface', swatchClassName: 'bg-surface' },
	{ name: 'surface-strong', swatchClassName: 'bg-surface-strong' },
	{ name: 'primary', swatchClassName: 'bg-primary' },
	{ name: 'secondary', swatchClassName: 'bg-secondary' },
	{ name: 'muted', swatchClassName: 'bg-muted' },
	{ name: 'accent', swatchClassName: 'bg-accent' },
	{ name: 'signal', swatchClassName: 'bg-signal' },
	{ name: 'signal-solid', swatchClassName: 'bg-signal-solid' },
	{ name: 'signal-soft', swatchClassName: 'bg-signal-soft' },
	{ name: 'success', swatchClassName: 'bg-success' },
	{ name: 'warning', swatchClassName: 'bg-warning' },
	{ name: 'destructive', swatchClassName: 'bg-destructive' },
	{ name: 'border', swatchClassName: 'bg-border' },
	{ name: 'border-strong', swatchClassName: 'bg-border-strong' },
	{ name: 'input', swatchClassName: 'bg-input', note: 'control borders' },
]

export const TEXT_STEPS: DesignTextStep[] = [
	{ name: 'caption', size: '12 / 16', className: 'text-caption' },
	{ name: 'small', size: '13 / 18', className: 'text-small' },
	{ name: 'body', size: '14 / 20', className: 'text-body' },
	{ name: 'subheading', size: '16 / 22', className: 'text-subheading' },
	{ name: 'title', size: '20 / 26', className: 'text-title' },
	{ name: 'headline', size: '28 / 34', className: 'text-headline' },
]

export const RADIUS_STEPS: DesignRadiusStep[] = [
	{ name: 'rounded-sm', className: 'rounded-sm' },
	{ name: 'rounded-md', className: 'rounded-md' },
	{ name: 'rounded-lg', className: 'rounded-lg' },
	{ name: 'rounded-xl', className: 'rounded-xl' },
]

export const CONTROL_STEPS: DesignControlStep[] = [
	{ name: 'control-sm', height: '32', className: 'h-control-sm' },
	{ name: 'control-md', height: '36', className: 'h-control-md' },
	{ name: 'control-lg', height: '40', className: 'h-control-lg' },
]

export const SAMPLE_ROWS: DesignRow[] = [
	{ id: 'sample-1', name: 'Alpha', status: 'Published', count: 1204 },
	{ id: 'sample-2', name: 'Beta', status: 'Draft', count: 87 },
	{ id: 'sample-3', name: 'Gamma', status: 'Published', count: 15032 },
]
