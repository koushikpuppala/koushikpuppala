'use client'

import type { MetadataFieldsProps } from 'types/components/admin'
import { useState } from 'react'
import { Button } from 'ui/button'
import { Input } from 'ui/input'
import { Plus, X } from 'components/icons'

export const KeywordsCard = ({ form, setField }: MetadataFieldsProps) => {
	const [draft, setDraft] = useState('')

	const add = () => {
		const keyword = draft.trim()

		if (!keyword || form.keywords.includes(keyword)) return

		setField('keywords', [...form.keywords, keyword])
		setDraft('')
	}

	return (
		<div className='border-border bg-surface space-y-4 rounded-2xl border p-6 shadow-xs'>
			<h2 className='text-foreground text-base font-semibold tracking-tight'>
				Meta Keywords & Discoverability
			</h2>
			<div className='flex gap-2'>
				<Input
					placeholder='Add keyword tag (e.g. Next.js)...'
					aria-label='New keyword'
					value={draft}
					onChange={e => setDraft(e.target.value)}
					onKeyDown={e => {
						if (e.key !== 'Enter') return

						e.preventDefault()
						add()
					}}
				/>
				<Button type='button' variant='secondary' onClick={add}>
					<Plus className='mr-1 size-4' />
					Add
				</Button>
			</div>

			<div className='flex flex-wrap gap-2 pt-1'>
				{form.keywords.map(keyword => (
					<span
						key={keyword}
						className='border-border bg-background text-foreground inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium'>
						{keyword}
						<button
							type='button'
							onClick={() =>
								setField(
									'keywords',
									form.keywords.filter(item => item !== keyword),
								)
							}
							aria-label={`Remove keyword ${keyword}`}
							className='text-muted-foreground hover:text-destructive'>
							<X className='size-3' />
						</button>
					</span>
				))}
			</div>
		</div>
	)
}
