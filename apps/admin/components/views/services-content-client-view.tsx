'use client'

import { useEffect, useState } from 'react'
import { Wrench } from '@/components/icons'
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
import { Textarea } from '@/components/ui/textarea'
import { CollectionManager, type ColumnDef } from '@/components/cms/collection-manager'
import { adminFetch } from '@/lib/api-client'

import type { Service } from 'types/models'

export const ServiceModal = ({
	open,
	onOpenChange,
	service,
	onSave,
}: {
	open: boolean
	onOpenChange: (v: boolean) => void
	service: Partial<Service> | null
	onSave: (svc: Partial<Service>) => Promise<void>
}) => {
	const [formData, setFormData] = useState<Partial<Service>>({
		title: '',
		description: '',
		features: [],
		status: 'PUBLISHED',
	})
	const [featureInput, setFeatureInput] = useState('')
	const [saving, setSaving] = useState(false)

	useEffect(() => {
		if (service) {
			setFormData({
				...service,
				features: Array.isArray(service.features) ? service.features : [],
			})
		} else {
			setFormData({
				title: '',
				description: '',
				features: [],
				status: 'PUBLISHED',
			})
		}
	}, [service])

	const addFeature = () => {
		if (!featureInput.trim()) return
		setFormData(prev => ({
			...prev,
			features: [...(prev.features || []), featureInput.trim()],
		}))
		setFeatureInput('')
	}

	const removeFeature = (index: number) => {
		setFormData(prev => ({
			...prev,
			features: (prev.features || []).filter((_, i) => i !== index),
		}))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setSaving(true)
		try {
			const payload: Partial<Service> = {
				title: formData.title || '',
				description: formData.description || '',
				features: Array.isArray(formData.features) ? formData.features : [],
				isPublished: formData.status === 'PUBLISHED',
			}
			await onSave(payload)
			onOpenChange(false)
		} finally {
			setSaving(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-md flex flex-col p-6' onClose={() => onOpenChange(false)}>
				<DialogHeader>
					<DialogTitle>{service?.id ? 'Edit Service' : 'Add Competency / Service'}</DialogTitle>
					<DialogDescription>Define service title, description, features, and visibility.</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<div className='space-y-1'>
						<Label className='text-xs'>Service Title</Label>
						<Input
							value={formData.title || ''}
							onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
							required
							placeholder='e.g. Full-Stack Web Development'
						/>
					</div>

					<div className='space-y-1'>
						<Label className='text-xs'>Description</Label>
						<Textarea
							value={formData.description || ''}
							onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
							rows={3}
							required
							placeholder='Scope of work, deliverables, and engineering practices…'
						/>
					</div>

					{/* Service Key Feature Highlights */}
					<div className='space-y-2'>
						<Label className='text-xs'>Key Feature Deliverables</Label>
						<div className='space-y-1.5'>
							{(formData.features || []).map((feat, i) => (
								<div
									key={i}
									className='flex items-center justify-between gap-2 rounded-lg border border-border bg-surface-strong/50 p-2 text-xs'>
									<span>{feat}</span>
									<button
										type='button'
										onClick={() => removeFeature(i)}
										className='text-muted-foreground hover:text-destructive'>
										×
									</button>
								</div>
							))}
						</div>
						<div className='flex gap-2'>
							<Input
								value={featureInput}
								onChange={e => setFeatureInput(e.target.value)}
								onKeyDown={e => {
									if (e.key === 'Enter') {
										e.preventDefault()
										addFeature()
									}
								}}
								placeholder='Add feature highlight…'
								className='h-8 text-xs'
							/>
							<Button type='button' variant='outline' size='sm' onClick={addFeature}>
								Add
							</Button>
						</div>
					</div>

					<div className='space-y-1'>
						<Label className='text-xs'>Status</Label>
						<select
							value={formData.status || 'PUBLISHED'}
							onChange={e =>
								setFormData(prev => ({ ...prev, status: e.target.value as Service['status'] }))
							}
							className='h-9 w-full rounded-lg border border-border bg-surface px-3 text-xs'>
							<option value='PUBLISHED'>PUBLISHED</option>
							<option value='DRAFT'>DRAFT</option>
							<option value='ARCHIVED'>ARCHIVED</option>
						</select>
					</div>

					<DialogFooter>
						<Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
							Cancel
						</Button>
						<Button type='submit' variant='signal' disabled={saving}>
							{saving ? 'Saving…' : 'Save Service'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}

export const ServicesContentClientView = () => {
	const [services, setServices] = useState<Service[]>([])
	const [loading, setLoading] = useState(true)
	const [modalOpen, setModalOpen] = useState(false)
	const [editingSvc, setEditingSvc] = useState<Service | null>(null)

	const loadServices = async () => {
		setLoading(true)
		try {
			const res = await adminFetch<{ items?: Service[] } | Service[]>('/api/v1/services')
			if (res.data) {
				const items = Array.isArray(res.data) ? res.data : (res.data.items || [])
				setServices(
					items.map(s => ({
						...s,
						status: s.isPublished || (s as { status?: string }).status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT',
					})),
				)
			}
		} catch (err) {
			console.error('Failed to load services:', err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadServices()
	}, [])

	const handleSave = async (formData: Partial<Service>) => {
		if (editingSvc?.id) {
			await adminFetch(`/api/v1/services/${editingSvc.id}`, {
				method: 'PATCH',
				body: JSON.stringify(formData),
			})
		} else {
			await adminFetch('/api/v1/services', {
				method: 'POST',
				body: JSON.stringify(formData),
			})
		}
		await loadServices()
	}

	const handleDelete = async (item: Service) => {
		await adminFetch(`/api/v1/services/${item.id}`, { method: 'DELETE' })
		setServices(prev => prev.filter(s => s.id !== item.id))
	}

	const handleTogglePublish = async (item: Service) => {
		const nextStatus = item.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
		await adminFetch(`/api/v1/services/${item.id}/publish`, { method: 'PATCH' })
		setServices(prev => prev.map(s => (s.id === item.id ? { ...s, status: nextStatus } : s)))
	}

	const columns: ColumnDef<Service>[] = [
		{
			key: 'title',
			header: 'Service / Offering',
			render: svc => (
				<div className='flex items-center gap-3'>
					<div className='size-8 rounded-lg bg-surface-strong border border-border grid place-items-center shrink-0'>
						<Wrench className='size-4 text-signal-ink' />
					</div>
					<div>
						<p className='font-semibold text-foreground'>{svc.title}</p>
						<p className='text-xs text-muted-foreground line-clamp-1 max-w-md'>{svc.description}</p>
					</div>
				</div>
			),
		},
		{
			key: 'status',
			header: 'Status',
			render: svc => (
				<Badge variant={svc.status === 'PUBLISHED' ? 'success' : 'warning'}>{svc.status}</Badge>
			),
		},
	]

	return (
		<div>
			<CollectionManager
				title='Services &amp; Engineering Competencies'
				description='Manage service offerings, advisory specialties, and architectural consulting capabilities.'
				items={services}
				columns={columns}
				loading={loading}
				searchKey={s => `${s.title} ${s.description}`}
				createLabel='Add Service'
				onCreate={() => {
					setEditingSvc(null)
					setModalOpen(true)
				}}
				onEdit={item => {
					setEditingSvc(item)
					setModalOpen(true)
				}}
				onDelete={handleDelete}
				onTogglePublish={handleTogglePublish}
			/>

			<ServiceModal
				open={modalOpen}
				onOpenChange={setModalOpen}
				service={editingSvc}
				onSave={handleSave}
			/>
		</div>
	)
}
