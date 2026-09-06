'use client'

import { useEffect, useState } from 'react'
import { Briefcase, Trash2 } from '@/components/icons'
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

export type Experience = {
	id: string
	company: string
	role: string
	location?: string | null
	startDate: string
	endDate?: string | null
	isCurrent: boolean
	description: string
	achievements: string[]
	technologies: string[]
	featured?: boolean
	status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
	sortOrder?: number
}

export const ExperienceModal = ({
	open,
	onOpenChange,
	experience,
	onSave,
}: {
	open: boolean
	onOpenChange: (v: boolean) => void
	experience: Partial<Experience> | null
	onSave: (exp: Partial<Experience>) => Promise<void>
}) => {
	const [formData, setFormData] = useState<Partial<Experience>>({
		company: '',
		role: '',
		location: '',
		startDate: '',
		endDate: '',
		isCurrent: false,
		description: '',
		achievements: [],
		technologies: [],
		status: 'PUBLISHED',
	})
	const [newAch, setNewAch] = useState('')
	const [saving, setSaving] = useState(false)

	useEffect(() => {
		if (experience) {
			setFormData({
				...experience,
				achievements: Array.isArray(experience.achievements) ? experience.achievements : [],
				technologies: Array.isArray(experience.technologies) ? experience.technologies : [],
			})
		} else {
			setFormData({
				company: '',
				role: '',
				location: '',
				startDate: '',
				endDate: '',
				isCurrent: false,
				description: '',
				achievements: [],
				technologies: ['TypeScript', 'Node.js', 'PostgreSQL'],
				status: 'PUBLISHED',
			})
		}
	}, [experience])

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

	const addAchievement = () => {
		if (!newAch.trim()) return
		setFormData(prev => ({
			...prev,
			achievements: [...(prev.achievements || []), newAch.trim()],
		}))
		setNewAch('')
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className='max-w-xl max-h-[85vh] flex flex-col p-6'
				onClose={() => onOpenChange(false)}>
				<DialogHeader>
					<DialogTitle>
						{experience?.id ? 'Edit Experience Record' : 'Add Experience Entry'}
					</DialogTitle>
					<DialogDescription>
						Add career milestones, company roles, and achievements.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className='flex-1 overflow-y-auto space-y-4 pr-1'>
					<div className='grid gap-4 sm:grid-cols-2'>
						<div className='space-y-1'>
							<Label className='text-xs'>Company / Organization</Label>
							<Input
								value={formData.company || ''}
								onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))}
								required
								placeholder='e.g. Upraised'
							/>
						</div>
						<div className='space-y-1'>
							<Label className='text-xs'>Role Title</Label>
							<Input
								value={formData.role || ''}
								onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
								required
								placeholder='e.g. Software Engineer'
							/>
						</div>
					</div>

					<div className='grid gap-4 sm:grid-cols-3'>
						<div className='space-y-1'>
							<Label className='text-xs'>Location</Label>
							<Input
								value={formData.location || ''}
								onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
								placeholder='Bengaluru, India'
							/>
						</div>
						<div className='space-y-1'>
							<Label className='text-xs'>Start Date</Label>
							<Input
								type='date'
								value={formData.startDate ? formData.startDate.slice(0, 10) : ''}
								onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
								required
							/>
						</div>
						<div className='space-y-1'>
							<Label className='text-xs'>End Date</Label>
							<Input
								type='date'
								value={formData.endDate ? formData.endDate.slice(0, 10) : ''}
								disabled={formData.isCurrent}
								onChange={e => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
							/>
						</div>
					</div>

					<label className='flex items-center gap-2 text-xs cursor-pointer'>
						<input
							type='checkbox'
							checked={Boolean(formData.isCurrent)}
							onChange={e =>
								setFormData(prev => ({
									...prev,
									isCurrent: e.target.checked,
									endDate: e.target.checked ? null : prev.endDate,
								}))
							}
							className='rounded border-border text-signal focus:ring-signal'
						/>
						<span>Currently working here</span>
					</label>

					<div className='space-y-1'>
						<Label className='text-xs'>Role Summary</Label>
						<Textarea
							value={formData.description || ''}
							onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
							rows={3}
							placeholder='Summary of responsibilities and technical ownership…'
						/>
					</div>

					{/* Key Achievements */}
					<div className='space-y-2'>
						<Label className='text-xs'>Bullet Achievements</Label>
						<div className='space-y-1.5'>
							{(formData.achievements || []).map((ach, i) => (
								<div
									key={i}
									className='flex items-center justify-between gap-2 rounded-lg border border-border bg-surface-strong/50 p-2 text-xs'>
									<span>{ach}</span>
									<button
										type='button'
										onClick={() =>
											setFormData(prev => ({
												...prev,
												achievements: (prev.achievements || []).filter((_, idx) => idx !== i),
											}))
										}
										className='text-muted-foreground hover:text-destructive'>
										<Trash2 className='size-3.5' />
									</button>
								</div>
							))}
						</div>
						<div className='flex gap-2'>
							<Input
								value={newAch}
								onChange={e => setNewAch(e.target.value)}
								placeholder='Add measurable impact bullet…'
								className='h-8 text-xs'
							/>
							<Button type='button' variant='outline' size='sm' onClick={addAchievement}>
								Add
							</Button>
						</div>
					</div>

					<DialogFooter>
						<Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
							Cancel
						</Button>
						<Button type='submit' variant='signal' disabled={saving}>
							{saving ? 'Saving…' : 'Save Experience'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}

export const ExperienceContentClientView = () => {
	const [experiences, setExperiences] = useState<Experience[]>([])
	const [loading, setLoading] = useState(true)
	const [modalOpen, setModalOpen] = useState(false)
	const [editingExp, setEditingExp] = useState<Experience | null>(null)

	const loadExperiences = async () => {
		setLoading(true)
		try {
			const res = await adminFetch<{ items?: Experience[] } | Experience[]>('/api/v1/experience')
			if (res.data) {
				const items = Array.isArray(res.data) ? res.data : (res.data.items || [])
				setExperiences(items)
			}
		} catch (err) {
			console.error('Failed to load experiences:', err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadExperiences()
	}, [])

	const handleSave = async (formData: Partial<Experience>) => {
		if (editingExp?.id) {
			await adminFetch(`/api/v1/experience/${editingExp.id}`, {
				method: 'PATCH',
				body: JSON.stringify(formData),
			})
		} else {
			await adminFetch('/api/v1/experience', {
				method: 'POST',
				body: JSON.stringify(formData),
			})
		}
		await loadExperiences()
	}

	const handleDelete = async (item: Experience) => {
		await adminFetch(`/api/v1/experience/${item.id}`, { method: 'DELETE' })
		setExperiences(prev => prev.filter(e => e.id !== item.id))
	}

	const handleTogglePublish = async (item: Experience) => {
		const nextStatus = item.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
		await adminFetch(`/api/v1/experience/${item.id}/publish`, { method: 'PATCH' })
		setExperiences(prev => prev.map(e => (e.id === item.id ? { ...e, status: nextStatus } : e)))
	}

	const columns: ColumnDef<Experience>[] = [
		{
			key: 'role',
			header: 'Role & Organization',
			render: exp => (
				<div className='flex items-center gap-3'>
					<div className='size-9 rounded-lg bg-surface-strong border border-border grid place-items-center shrink-0'>
						<Briefcase className='size-4 text-signal-ink' />
					</div>
					<div>
						<p className='font-semibold text-foreground'>{exp.role}</p>
						<p className='text-xs text-muted-foreground'>
							{exp.company} • {exp.location}
						</p>
					</div>
				</div>
			),
		},
		{
			key: 'dates',
			header: 'Duration',
			render: exp => (
				<span className='font-mono text-xs text-muted-foreground'>
					{new Date(exp.startDate).toLocaleDateString([], { month: 'short', year: 'numeric' })} —{' '}
					{exp.isCurrent
						? 'Present'
						: exp.endDate
							? new Date(exp.endDate).toLocaleDateString([], { month: 'short', year: 'numeric' })
							: 'N/A'}
				</span>
			),
		},
		{
			key: 'status',
			header: 'Status',
			render: exp => (
				<Badge variant={exp.status === 'PUBLISHED' ? 'success' : 'warning'}>{exp.status}</Badge>
			),
		},
	]

	return (
		<div>
			<CollectionManager
				title='Experience Timeline'
				description='Manage professional career trajectory, engineering positions, and key technical achievements.'
				items={experiences}
				columns={columns}
				loading={loading}
				searchKey={e => `${e.role} ${e.company} ${e.location}`}
				createLabel='Add Experience'
				onCreate={() => {
					setEditingExp(null)
					setModalOpen(true)
				}}
				onEdit={item => {
					setEditingExp(item)
					setModalOpen(true)
				}}
				onDelete={handleDelete}
				onTogglePublish={handleTogglePublish}
			/>

			<ExperienceModal
				open={modalOpen}
				onOpenChange={setModalOpen}
				experience={editingExp}
				onSave={handleSave}
			/>
		</div>
	)
}
