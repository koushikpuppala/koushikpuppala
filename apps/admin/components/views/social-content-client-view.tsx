'use client'

import { useEffect, useState } from 'react'
import { Share2 } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CollectionManager, type ColumnDef } from '@/components/cms/collection-manager'
import { adminFetch } from '@/lib/api-client'

export type Social = {
	id: string
	platform: string
	label: string
	url: string
	handle?: string | null
	status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
	sortOrder?: number
}

export const SocialModal = ({
	open,
	onOpenChange,
	social,
	onSave,
}: {
	open: boolean
	onOpenChange: (v: boolean) => void
	social: Partial<Social> | null
	onSave: (soc: Partial<Social>) => Promise<void>
}) => {
	const [formData, setFormData] = useState<Partial<Social>>({
		platform: 'github',
		label: '',
		url: '',
		handle: '',
		status: 'PUBLISHED',
	})
	const [saving, setSaving] = useState(false)

	useEffect(() => {
		if (social) {
			setFormData(social)
		} else {
			setFormData({
				platform: 'github',
				label: '',
				url: '',
				handle: '',
				status: 'PUBLISHED',
			})
		}
	}, [social])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setSaving(true)
		try {
			await onSave(formData)
			onOpenChange(false)
		} finally {
			setSaving(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-md flex flex-col p-6' onClose={() => onOpenChange(false)}>
				<DialogHeader>
					<DialogTitle>{social?.id ? 'Edit Social Link' : 'Add Social Channel'}</DialogTitle>
					<DialogDescription>Configure verified communication channel details.</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<div className='space-y-1'>
						<Label className='text-xs'>Platform</Label>
						<select
							value={formData.platform || 'github'}
							onChange={e =>
								setFormData(prev => ({
									...prev,
									platform: e.target.value,
									label: prev.label || e.target.value.toUpperCase(),
								}))
							}
							className='h-9 w-full rounded-lg border border-border bg-surface px-3 text-xs'>
							<option value='github'>GitHub</option>
							<option value='linkedin'>LinkedIn</option>
							<option value='twitter'>Twitter / X</option>
							<option value='discord'>Discord</option>
							<option value='email'>Official Email</option>
							<option value='youtube'>YouTube</option>
							<option value='other'>Other / External</option>
						</select>
					</div>

					<div className='space-y-1'>
						<Label className='text-xs'>Display Label</Label>
						<Input
							value={formData.label || ''}
							onChange={e => setFormData(prev => ({ ...prev, label: e.target.value }))}
							required
							placeholder='e.g. GitHub'
						/>
					</div>

					<div className='space-y-1'>
						<Label className='text-xs'>Profile URL</Label>
						<Input
							value={formData.url || ''}
							onChange={e => setFormData(prev => ({ ...prev, url: e.target.value }))}
							required
							placeholder='https://…'
						/>
					</div>

					<div className='space-y-1'>
						<Label className='text-xs'>Handle / Username (Optional)</Label>
						<Input
							value={formData.handle || ''}
							onChange={e => setFormData(prev => ({ ...prev, handle: e.target.value }))}
							placeholder='@koushikpuppala'
						/>
					</div>

					<div className='space-y-1'>
						<Label className='text-xs'>Status</Label>
						<select
							value={formData.status || 'PUBLISHED'}
							onChange={e =>
								setFormData(prev => ({ ...prev, status: e.target.value as Social['status'] }))
							}
							className='h-9 w-full rounded-lg border border-border bg-surface px-3 text-xs font-mono'>
							<option value='PUBLISHED'>PUBLISHED</option>
							<option value='DRAFT'>DRAFT</option>
						</select>
					</div>

					<DialogFooter>
						<Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
							Cancel
						</Button>
						<Button type='submit' variant='signal' disabled={saving}>
							{saving ? 'Saving…' : 'Save Social Link'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}

export const SocialContentClientView = () => {
	const [socials, setSocials] = useState<Social[]>([])
	const [loading, setLoading] = useState(true)
	const [modalOpen, setModalOpen] = useState(false)
	const [editingSoc, setEditingSoc] = useState<Social | null>(null)

	const loadSocials = async () => {
		setLoading(true)
		try {
			const res = await adminFetch<{ items?: Social[] } | Social[]>('/api/v1/socials')
			if (res.data) {
				const items = Array.isArray(res.data) ? res.data : (res.data.items || [])
				setSocials(items)
			}
		} catch (err) {
			console.error('Failed to load socials:', err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadSocials()
	}, [])

	const handleSave = async (formData: Partial<Social>) => {
		if (editingSoc?.id) {
			await adminFetch(`/api/v1/socials/${editingSoc.id}`, {
				method: 'PATCH',
				body: JSON.stringify(formData),
			})
		} else {
			await adminFetch('/api/v1/socials', {
				method: 'POST',
				body: JSON.stringify(formData),
			})
		}
		await loadSocials()
	}

	const handleDelete = async (item: Social) => {
		await adminFetch(`/api/v1/socials/${item.id}`, { method: 'DELETE' })
		setSocials(prev => prev.filter(s => s.id !== item.id))
	}

	const handleTogglePublish = async (item: Social) => {
		const nextStatus = item.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
		await adminFetch(`/api/v1/socials/${item.id}/publish`, { method: 'PATCH' })
		setSocials(prev => prev.map(s => (s.id === item.id ? { ...s, status: nextStatus } : s)))
	}

	const columns: ColumnDef<Social>[] = [
		{
			key: 'label',
			header: 'Platform & Label',
			render: soc => (
				<div className='flex items-center gap-3'>
					<div className='size-8 rounded-lg bg-surface-strong border border-border grid place-items-center shrink-0'>
						<Share2 className='size-4 text-signal-ink' />
					</div>
					<div>
						<p className='font-semibold text-foreground'>{soc.label}</p>
						<p className='font-mono text-xs text-muted-foreground'>{soc.handle || soc.url}</p>
					</div>
				</div>
			),
		},
		{
			key: 'url',
			header: 'Target Link',
			render: soc => (
				<a
					href={soc.url}
					target='_blank'
					rel='noopener noreferrer'
					className='font-mono text-xs text-signal-ink hover:underline truncate max-w-xs block'>
					{soc.url}
				</a>
			),
		},
		{
			key: 'status',
			header: 'Status',
			render: soc => (
				<Badge variant={soc.status === 'PUBLISHED' ? 'success' : 'warning'}>{soc.status}</Badge>
			),
		},
	]

	return (
		<div>
			<CollectionManager
				title='Social Channels &amp; Links'
				description='Manage verified developer communication channels, handles, and external links.'
				items={socials}
				columns={columns}
				loading={loading}
				searchKey={s => `${s.label} ${s.platform} ${s.handle || ''}`}
				createLabel='Add Channel'
				onCreate={() => {
					setEditingSoc(null)
					setModalOpen(true)
				}}
				onEdit={item => {
					setEditingSoc(item)
					setModalOpen(true)
				}}
				onDelete={handleDelete}
				onTogglePublish={handleTogglePublish}
			/>

			<SocialModal
				open={modalOpen}
				onOpenChange={setModalOpen}
				social={editingSoc}
				onSave={handleSave}
			/>
		</div>
	)
}
