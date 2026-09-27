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
import { CollectionManager, type ColumnDef } from '@/components/cms/collection-manager'
import { adminFetch } from '@/lib/api-client'

import type { Experience } from 'types/models'

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
		title: '',
		location: '',
		employmentType: 'FULL_TIME',
		startDate: '',
		endDate: '',
		isCurrent: false,
		featured: false,
		description: [],
		achievements: [],
		technologies: [],
		website: '',
		status: 'PUBLISHED',
	})
	const [descInput, setDescInput] = useState('')
	const [newAch, setNewAch] = useState('')
	const [newTech, setNewTech] = useState('')
	const [saving, setSaving] = useState(false)

	useEffect(() => {
		if (experience) {
			setFormData({
				...experience,
				title: experience.title || (experience as { role?: string }).role || '',
				description: Array.isArray(experience.description)
					? experience.description
					: typeof experience.description === 'string' && experience.description
						? [experience.description]
						: [],
				achievements: Array.isArray(experience.achievements) ? experience.achievements : [],
				technologies: Array.isArray(experience.technologies) ? experience.technologies : [],
				employmentType: experience.employmentType || 'FULL_TIME',
			})
		} else {
			setFormData({
				company: '',
				title: '',
				location: '',
				employmentType: 'FULL_TIME',
				startDate: '',
				endDate: '',
				isCurrent: false,
				featured: false,
				description: [],
				achievements: [],
				technologies: [],
				website: '',
				status: 'PUBLISHED',
			})
		}
	}, [experience])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setSaving(true)
		try {
			const payload: Partial<Experience> = {
				...formData,
				title: formData.title || '',
				company: formData.company || '',
				location: formData.location || '',
				employmentType: formData.employmentType || 'FULL_TIME',
				startDate: formData.startDate || new Date().toISOString(),
				endDate: formData.isCurrent ? null : formData.endDate || null,
				isCurrent: Boolean(formData.isCurrent),
				featured: Boolean(formData.featured),
				description: Array.isArray(formData.description) ? formData.description : [],
				achievements: Array.isArray(formData.achievements) ? formData.achievements : [],
				technologies: Array.isArray(formData.technologies) ? formData.technologies : [],
				website: formData.website || null,
				isPublished: formData.status === 'PUBLISHED',
			}
			await onSave(payload)
			onOpenChange(false)
		} finally {
			setSaving(false)
		}
	}

	const addDescription = () => {
		if (!descInput.trim()) return
		setFormData((prev: Partial<Experience>) => ({
			...prev,
			description: [...(prev.description || []), descInput.trim()],
		}))
		setDescInput('')
	}

	const addAchievement = () => {
		if (!newAch.trim()) return
		setFormData((prev: Partial<Experience>) => ({
			...prev,
			achievements: [...(prev.achievements || []), newAch.trim()],
		}))
		setNewAch('')
	}

	const addTechnology = () => {
		if (!newTech.trim()) return
		setFormData((prev: Partial<Experience>) => ({
			...prev,
			technologies: [...(prev.technologies || []), newTech.trim()],
		}))
		setNewTech('')
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
						Add career milestones, company roles, technologies, and achievements.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className='flex-1 overflow-y-auto space-y-4 pr-1'>
					<div className='grid gap-4 sm:grid-cols-2'>
						<div className='space-y-1'>
							<Label className='text-xs'>Company / Organization</Label>
							<Input
								value={formData.company || ''}
								onChange={e => setFormData((prev: Partial<Experience>) => ({ ...prev, company: e.target.value }))}
								required
								placeholder='e.g. Upraised'
							/>
						</div>
						<div className='space-y-1'>
							<Label className='text-xs'>Role Title</Label>
							<Input
								value={formData.title || ''}
								onChange={e => setFormData((prev: Partial<Experience>) => ({ ...prev, title: e.target.value }))}
								required
								placeholder='e.g. Software Engineer'
							/>
						</div>
					</div>

					<div className='grid gap-4 sm:grid-cols-2'>
						<div className='space-y-1'>
							<Label className='text-xs'>Location</Label>
							<Input
								value={formData.location || ''}
								onChange={e => setFormData((prev: Partial<Experience>) => ({ ...prev, location: e.target.value }))}
								placeholder='Bengaluru, Karnataka, India'
							/>
						</div>
						<div className='space-y-1'>
							<Label className='text-xs'>Employment Type</Label>
							<select
								value={formData.employmentType || 'FULL_TIME'}
								onChange={e =>
									setFormData((prev: Partial<Experience>) => ({
										...prev,
										employmentType: e.target.value as Experience['employmentType'],
									}))
								}
								className='h-9 w-full rounded-lg border border-border bg-surface px-3 text-xs'>
								<option value='FULL_TIME'>Full time</option>
								<option value='PART_TIME'>Part time</option>
								<option value='INTERN'>Internship</option>
								<option value='CONTRACT'>Contract</option>
								<option value='FREELANCE'>Freelance</option>
							</select>
						</div>
					</div>

					<div className='grid gap-4 sm:grid-cols-2'>
						<div className='space-y-1'>
							<Label className='text-xs'>Start Date</Label>
							<Input
								type='date'
								value={formData.startDate ? String(formData.startDate).slice(0, 10) : ''}
								onChange={e => setFormData((prev: Partial<Experience>) => ({ ...prev, startDate: e.target.value }))}
								required
							/>
						</div>
						<div className='space-y-1'>
							<Label className='text-xs'>End Date</Label>
							<Input
								type='date'
								value={formData.endDate ? String(formData.endDate).slice(0, 10) : ''}
								disabled={formData.isCurrent}
								onChange={e => setFormData((prev: Partial<Experience>) => ({ ...prev, endDate: e.target.value }))}
							/>
						</div>
					</div>

					<div className='space-y-1'>
						<Label className='text-xs'>Company Website URL</Label>
						<Input
							value={formData.website || ''}
							onChange={e => setFormData((prev: Partial<Experience>) => ({ ...prev, website: e.target.value }))}
							placeholder='https://upraised.co'
						/>
					</div>

					<div className='flex items-center justify-between pt-1'>
						<label className='flex items-center gap-2 text-xs cursor-pointer'>
							<input
								type='checkbox'
								checked={Boolean(formData.isCurrent)}
								onChange={e =>
									setFormData((prev: Partial<Experience>) => ({
										...prev,
										isCurrent: e.target.checked,
										endDate: e.target.checked ? null : prev.endDate,
									}))
								}
								className='rounded border-border text-signal focus:ring-signal'
							/>
							<span>Currently working here</span>
						</label>

						<label className='flex items-center gap-2 text-xs cursor-pointer'>
							<input
								type='checkbox'
								checked={Boolean(formData.featured)}
								onChange={e => setFormData((prev: Partial<Experience>) => ({ ...prev, featured: e.target.checked }))}
								className='rounded border-border text-signal focus:ring-signal'
							/>
							<span>Feature on portfolio</span>
						</label>
					</div>

					{/* Role Bullet Descriptions */}
					<div className='space-y-2'>
						<Label className='text-xs'>Role Responsibilities</Label>
						<div className='space-y-1.5'>
							{(Array.isArray(formData.description) ? formData.description : []).map((desc: string, i: number) => (
								<div
									key={i}
									className='flex items-center justify-between gap-2 rounded-lg border border-border bg-surface-strong/50 p-2 text-xs'>
									<span>{desc}</span>
									<button
										type='button'
										onClick={() =>
											setFormData((prev: Partial<Experience>) => ({
												...prev,
												description: (Array.isArray(prev.description) ? prev.description : []).filter((_: string, idx: number) => idx !== i),
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
								value={descInput}
								onChange={e => setDescInput(e.target.value)}
								placeholder='Add role responsibility bullet…'
								className='h-8 text-xs'
							/>
							<Button type='button' variant='outline' size='sm' onClick={addDescription}>
								Add
							</Button>
						</div>
					</div>

					{/* Key Achievements */}
					<div className='space-y-2'>
						<Label className='text-xs'>Measurable Achievements</Label>
						<div className='space-y-1.5'>
							{(formData.achievements || []).map((ach: string, i: number) => (
								<div
									key={i}
									className='flex items-center justify-between gap-2 rounded-lg border border-border bg-surface-strong/50 p-2 text-xs'>
									<span>{ach}</span>
									<button
										type='button'
										onClick={() =>
											setFormData((prev: Partial<Experience>) => ({
												...prev,
												achievements: (prev.achievements || []).filter((_: string, idx: number) => idx !== i),
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

					{/* Technologies */}
					<div className='space-y-2'>
						<Label className='text-xs'>Technologies Used</Label>
						<div className='flex flex-wrap gap-1.5'>
							{(formData.technologies || []).map((tech: string, i: number) => (
								<Badge key={i} variant='secondary' className='gap-1 pr-1'>
									<span>{tech}</span>
									<button
										type='button'
										onClick={() =>
											setFormData((prev: Partial<Experience>) => ({
												...prev,
												technologies: (prev.technologies || []).filter((_: string, idx: number) => idx !== i),
											}))
										}
										className='text-muted-foreground hover:text-destructive'>
										×
									</button>
								</Badge>
							))}
						</div>
						<div className='flex gap-2'>
							<Input
								value={newTech}
								onChange={e => setNewTech(e.target.value)}
								placeholder='Add technology (e.g. Next.js, PostgreSQL)…'
								className='h-8 text-xs'
							/>
							<Button type='button' variant='outline' size='sm' onClick={addTechnology}>
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
	const [error, setError] = useState<string | null>(null)
	const [modalOpen, setModalOpen] = useState(false)
	const [editingExp, setEditingExp] = useState<Experience | null>(null)

	const loadExperiences = async () => {
		setLoading(true)
		setError(null)
		try {
			const res = await adminFetch<{ items?: Experience[] } | Experience[]>('/api/v1/experience')
			if (res.data) {
				const items = Array.isArray(res.data) ? res.data : (res.data.items || [])
				setExperiences(
					items.map(item => ({
						...item,
						title: item.title || (item as { role?: string }).role || '',
						status: item.isPublished || (item as { status?: string }).status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT',
					})),
				)
			} else if (res.error) {
				setError(res.error)
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to load experiences from API.')
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
						<p className='font-semibold text-foreground'>{exp.title}</p>
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
					{exp.startDate
						? new Date(exp.startDate).toLocaleDateString([], { month: 'short', year: 'numeric' })
						: ''}{' '}
					—{' '}
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
				error={error}
				onRetry={loadExperiences}
				searchKey={e => `${e.title} ${e.company} ${e.location}`}
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
