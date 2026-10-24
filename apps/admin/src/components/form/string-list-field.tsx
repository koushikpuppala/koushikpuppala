'use client'

import type { StringListFieldProps } from 'types/components/admin'
import { useState } from 'react'
import { Button } from 'ui/button'
import { Input } from 'ui/input'
import { Label } from 'ui/label'
import { Trash2 } from 'components/icons'
import { Badge } from 'components/ui/badge'

export const StringListField = ({
	label,
	items,
	onChange,
	placeholder,
	variant = 'rows',
	chipVariant = 'secondary',
}: StringListFieldProps) => {
	const [draft, setDraft] = useState('')
	const list = items ?? []

	const add = () => {
		const value = draft.trim()

		if (!value) return

		onChange([...list, value])
		setDraft('')
	}

	const remove = (index: number) => onChange(list.filter((_, i) => i !== index))

	return (
		<div className='space-y-2'>
			<Label className='text-xs'>{label}</Label>
			{variant === 'chips' ? (
				<div className='flex flex-wrap gap-1.5'>
					{list.map((item, index) => (
						<Badge key={`${index}-${item}`} variant={chipVariant} className='gap-1 pr-1'>
							<span>{item}</span>
							<button
								type='button'
								aria-label={`Remove ${item}`}
								onClick={() => remove(index)}
								className='text-muted-foreground hover:text-destructive'>
								×
							</button>
						</Badge>
					))}
				</div>
			) : (
				<div className='space-y-1.5'>
					{list.map((item, index) => (
						<div
							key={`${index}-${item}`}
							className='border-border bg-surface-strong/50 flex items-center justify-between gap-2 rounded-lg border p-2 text-xs'>
							<span>{item}</span>
							<button
								type='button'
								aria-label={`Remove ${item}`}
								onClick={() => remove(index)}
								className='text-muted-foreground hover:text-destructive'>
								<Trash2 className='size-3.5' />
							</button>
						</div>
					))}
				</div>
			)}
			<div className='flex gap-2'>
				<Input
					value={draft}
					onChange={event => setDraft(event.target.value)}
					onKeyDown={event => {
						if (event.key !== 'Enter') return

						event.preventDefault()
						add()
					}}
					placeholder={placeholder}
					aria-label={placeholder}
					className='h-8 text-xs'
				/>
				<Button type='button' variant='outline' size='sm' onClick={add}>
					Add
				</Button>
			</div>
		</div>
	)
}
