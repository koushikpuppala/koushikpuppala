'use client'

import type { AboutStat } from 'types/models'
import type { AboutStatsFieldProps } from 'types/components/admin'
import { useState } from 'react'
import { Button } from 'ui/button'
import { Input } from 'ui/input'
import { Label } from 'ui/label'
import { Plus, Trash2 } from 'components/icons'

const BLANK: AboutStat = { label: '', value: '', detail: '' }

export const AboutStatsField = ({ stats, onChange }: AboutStatsFieldProps) => {
	const [draft, setDraft] = useState<AboutStat>(BLANK)

	const set = (key: keyof AboutStat, value: string) => setDraft(prev => ({ ...prev, [key]: value }))

	const add = () => {
		if (!draft.label.trim() || !draft.value.trim()) return

		onChange([...stats, { ...draft }])
		setDraft(BLANK)
	}

	return (
		<div className='border-border space-y-3 border-t pt-2'>
			<Label className='text-muted-foreground block font-mono text-xs uppercase'>
				Key Engineering Statistics &amp; Metrics
			</Label>
			<div className='space-y-2'>
				{stats.map((stat, index) => (
					<div
						key={`${index}-${stat.label}`}
						className='border-border bg-surface-strong/50 flex items-center justify-between gap-3 rounded-xl border p-3 text-xs'>
						<div className='flex items-center gap-4 font-mono'>
							<span className='text-signal-ink font-bold uppercase'>{stat.label}</span>
							<span className='text-foreground font-medium'>{stat.value}</span>
							{stat.detail && (
								<span className='text-muted-foreground text-[0.7rem]'>{stat.detail}</span>
							)}
						</div>
						<button
							type='button'
							onClick={() => onChange(stats.filter((_, i) => i !== index))}
							aria-label={`Remove ${stat.label} stat`}
							className='text-muted-foreground hover:text-destructive p-1'>
							<Trash2 className='size-3.5' />
						</button>
					</div>
				))}
			</div>
			<div className='grid gap-2 pt-1 sm:grid-cols-3'>
				<Input
					value={draft.label}
					onChange={e => set('label', e.target.value)}
					placeholder='Label (e.g. EXPERIENCE)'
					aria-label='New stat label'
					className='h-9 font-mono text-xs'
				/>
				<Input
					value={draft.value}
					onChange={e => set('value', e.target.value)}
					placeholder='Value (e.g. 3+)'
					aria-label='New stat value'
					className='h-9 font-mono text-xs'
				/>
				<div className='flex items-center gap-2'>
					<Input
						value={draft.detail ?? ''}
						onChange={e => set('detail', e.target.value)}
						placeholder='Detail (e.g. Years of Engineering)'
						aria-label='New stat detail'
						className='h-9 text-xs'
					/>
					<Button type='button' variant='secondary' size='sm' onClick={add} className='shrink-0'>
						<Plus className='size-3.5' />
						<span>Add</span>
					</Button>
				</div>
			</div>
		</div>
	)
}
