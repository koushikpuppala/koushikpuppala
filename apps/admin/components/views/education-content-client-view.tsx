'use client'

import { useEffect, useState } from 'react'
import { BookOpen, Trash2 } from '@/components/icons'
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

export type Education = {
	id: string
	institution: string
	degree: string
	field?: string | null
	startDate: string
	endDate?: string | null
	grade?: string | null
	mentor?: string | null
	description?: string | null
	achievements: string[]
	status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
	sortOrder?: number
}

export const EducationModal = ({
	open,
	onOpenChange,
	education,
	onSave,
}: {
	open: boolean
	onOpenChange: (v: boolean) => void
	education: Partial<Education> | null
	onSave: (edu: Partial<Education>) => Promise<void>
}) => {
	const [formData, setFormData] = useState<Partial<Education>>({
		institution: '',
		degree: '',
		field: '',
		startDate: '',
		endDate: '',
		grade: '',
		description: '',
		achievements: [],
		status: 'PUBLISHED',
	})
	const [newAch, setNewAch] = useState('')
	const [saving, setSaving] = useState(false)

	useEffect(() => {
		if (education) {
			setFormData({
				...education,
				achievements: Array.isArray(education.achievements) ? education.achievements : [],
			})
		} else {
			setFormData({
				institution: '',
				degree: 'Bachelor of Technology',
				field: 'Computer Science',
				startDate: '',
				endDate: '',
				grade: '',
				description: '',
				achievements: [],
				status: 'PUBLISHED',
			})
		}
	}, [education])

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
						{education?.id ? 'Edit Education Record' : 'Add Academic Qualification'}
					</DialogTitle>
					<DialogDescription>Institution, degree, coursework, and honors.</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className='flex-1 overflow-y-auto space-y-4 pr-1'>
					<div className='space-y-1'>
						<Label className='text-xs'>Institution Name</Label>
						<Input
							value={formData.institution || ''}
							onChange={e => setFormData(prev => ({ ...prev, institution: e.target.value }))}
							required
							placeholder='e.g. IIIT Raichur'
						/>
					</div>

					<div className='grid gap-4 sm:grid-cols-2'>
						<div className='space-y-1'>
							<Label className='text-xs'>Degree</Label>
							<Input
								value={formData.degree || ''}
								onChange={e => setFormData(prev => ({ ...prev, degree: e.target.value }))}
								required
								placeholder='B.Tech in Computer Science'
							/>
						</div>
						<div className='space-y-1'>
							<Label className='text-xs'>Major / Field</Label>
							<Input
								value={formData.field || ''}
								onChange={e => setFormData(prev => ({ ...prev, field: e.target.value }))}
								placeholder='Computer Science and Engineering'
							/>
						</div>
					</div>

					<div className='grid gap-4 sm:grid-cols-3'>
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
							<Label className='text-xs'>Graduation Date</Label>
							<Input
								type='date'
								value={formData.endDate ? formData.endDate.slice(0, 10) : ''}
								onChange={e => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
							/>
						</div>
						<div className='space-y-1'>
							<Label className='text-xs'>Grade / Honors</Label>
							<Input
								value={formData.grade || ''}
								onChange={e => setFormData(prev => ({ ...prev, grade: e.target.value }))}
								placeholder='First Class Distinction'
							/>
						</div>
					</div>

					<div className='space-y-1'>
						<Label className='text-xs'>Coursework &amp; Overview</Label>
						<Textarea
							value={formData.description || ''}
							onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
							rows={3}
							placeholder='Key courses, academic thesis, or research projects…'
						/>
					</div>

					{/* Honors & Achievements */}
					<div className='space-y-2'>
						<Label className='text-xs'>Academic Achievements</Label>
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
								placeholder='Add academic honor or leadership milestone…'
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
							{saving ? 'Saving…' : 'Save Education'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}

export const EducationContentClientView = () => {
	const [educations, setEducations] = useState<Education[]>([])
	const [loading, setLoading] = useState(true)
	const [modalOpen, setModalOpen] = useState(false)
	const [editingEdu, setEditingEdu] = useState<Education | null>(null)

	const loadEducation = async () => {
		setLoading(true)
		try {
			const res = await adminFetch<{ items?: Education[] } | Education[]>('/api/v1/education')
			if (res.data) {
				const items = Array.isArray(res.data) ? res.data : (res.data.items || [])
				setEducations(items)
			}
		} catch (err) {
			console.error('Failed to load education:', err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadEducation()
	}, [])

	const handleSave = async (formData: Partial<Education>) => {
		if (editingEdu?.id) {
			await adminFetch(`/api/v1/education/${editingEdu.id}`, {
				method: 'PATCH',
				body: JSON.stringify(formData),
			})
		} else {
			await adminFetch('/api/v1/education', {
				method: 'POST',
				body: JSON.stringify(formData),
			})
		}
		await loadEducation()
	}

	const handleDelete = async (item: Education) => {
		await adminFetch(`/api/v1/education/${item.id}`, { method: 'DELETE' })
		setEducations(prev => prev.filter(e => e.id !== item.id))
	}

	const handleTogglePublish = async (item: Education) => {
		const nextStatus = item.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
		await adminFetch(`/api/v1/education/${item.id}/publish`, { method: 'PATCH' })
		setEducations(prev => prev.map(e => (e.id === item.id ? { ...e, status: nextStatus } : e)))
	}

	const columns: ColumnDef<Education>[] = [
		{
			key: 'institution',
			header: 'Degree & Institution',
			render: edu => (
				<div className='flex items-center gap-3'>
					<div className='size-9 rounded-lg bg-surface-strong border border-border grid place-items-center shrink-0'>
						<BookOpen className='size-4 text-signal-ink' />
					</div>
					<div>
						<p className='font-semibold text-foreground'>{edu.degree}</p>
						<p className='text-xs text-muted-foreground'>{edu.institution}</p>
					</div>
				</div>
			),
		},
		{
			key: 'dates',
			header: 'Class Of',
			render: edu => (
				<span className='font-mono text-xs text-muted-foreground'>
					{new Date(edu.startDate).getFullYear()} —{' '}
					{edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
				</span>
			),
		},
		{
			key: 'grade',
			header: 'Honors',
			render: edu => (
				<span className='text-xs font-mono text-foreground/80'>{edu.grade || '—'}</span>
			),
		},
		{
			key: 'status',
			header: 'Status',
			render: edu => (
				<Badge variant={edu.status === 'PUBLISHED' ? 'success' : 'warning'}>{edu.status}</Badge>
			),
		},
	]

	return (
		<div>
			<CollectionManager
				title='Academic Qualifications'
				description='Manage universities, degrees, engineering coursework, honors, and certifications.'
				items={educations}
				columns={columns}
				loading={loading}
				searchKey={e => `${e.institution} ${e.degree} ${e.field}`}
				createLabel='Add Education'
				onCreate={() => {
					setEditingEdu(null)
					setModalOpen(true)
				}}
				onEdit={item => {
					setEditingEdu(item)
					setModalOpen(true)
				}}
				onDelete={handleDelete}
				onTogglePublish={handleTogglePublish}
			/>

			<EducationModal
				open={modalOpen}
				onOpenChange={setModalOpen}
				education={editingEdu}
				onSave={handleSave}
			/>
		</div>
	)
}
