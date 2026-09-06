'use client'

import { useEffect, useState } from 'react'
import { Zap } from '@/components/icons'
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

export type Skill = {
	id: string
	name: string
	category: string
	proficiency?: number
	icon?: string | null
	featured?: boolean
	status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
	sortOrder?: number
}

export const SkillModal = ({
	open,
	onOpenChange,
	skill,
	onSave,
}: {
	open: boolean
	onOpenChange: (v: boolean) => void
	skill: Partial<Skill> | null
	onSave: (sk: Partial<Skill>) => Promise<void>
}) => {
	const [formData, setFormData] = useState<Partial<Skill>>({
		name: '',
		category: 'Frontend',
		proficiency: 90,
		featured: false,
		status: 'PUBLISHED',
	})
	const [saving, setSaving] = useState(false)

	useEffect(() => {
		if (skill) {
			setFormData(skill)
		} else {
			setFormData({
				name: '',
				category: 'Frontend',
				proficiency: 90,
				featured: false,
				status: 'PUBLISHED',
			})
		}
	}, [skill])

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
					<DialogTitle>{skill?.id ? 'Edit Skill' : 'Add Tech Skill'}</DialogTitle>
					<DialogDescription>Define skill name, category, and proficiency level.</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<div className='space-y-1'>
						<Label className='text-xs'>Skill Name</Label>
						<Input
							value={formData.name || ''}
							onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
							required
							placeholder='e.g. Next.js 16 or PostgreSQL'
						/>
					</div>

					<div className='grid gap-4 sm:grid-cols-2'>
						<div className='space-y-1'>
							<Label className='text-xs'>Category</Label>
							<select
								value={formData.category || 'Frontend'}
								onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
								className='h-9 w-full rounded-lg border border-border bg-surface px-3 text-xs'>
								<option value='Frontend'>Frontend</option>
								<option value='Backend'>Backend</option>
								<option value='Database'>Database</option>
								<option value='Cloud & DevOps'>Cloud &amp; DevOps</option>
								<option value='Languages'>Languages</option>
								<option value='Architecture'>Architecture</option>
							</select>
						</div>

						<div className='space-y-1'>
							<Label className='text-xs'>Proficiency (%)</Label>
							<Input
								type='number'
								min={1}
								max={100}
								value={formData.proficiency ?? 90}
								onChange={e =>
									setFormData(prev => ({ ...prev, proficiency: Number(e.target.value) }))
								}
							/>
						</div>
					</div>

					<div className='flex items-center justify-between pt-2 border-t border-border'>
						<label className='flex items-center gap-2 text-xs cursor-pointer'>
							<input
								type='checkbox'
								checked={Boolean(formData.featured)}
								onChange={e => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
								className='rounded border-border text-signal focus:ring-signal'
							/>
							<span>Feature on Homepage ticker</span>
						</label>

						<select
							value={formData.status || 'PUBLISHED'}
							onChange={e =>
								setFormData(prev => ({ ...prev, status: e.target.value as Skill['status'] }))
							}
							className='h-8 rounded-lg border border-border bg-surface px-2.5 text-xs font-mono'>
							<option value='PUBLISHED'>PUBLISHED</option>
							<option value='DRAFT'>DRAFT</option>
						</select>
					</div>

					<DialogFooter>
						<Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
							Cancel
						</Button>
						<Button type='submit' variant='signal' disabled={saving}>
							{saving ? 'Saving…' : 'Save Skill'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}

export const SkillsContentClientView = () => {
	const [skills, setSkills] = useState<Skill[]>([])
	const [loading, setLoading] = useState(true)
	const [modalOpen, setModalOpen] = useState(false)
	const [editingSkill, setEditingSkill] = useState<Skill | null>(null)

	const loadSkills = async () => {
		setLoading(true)
		try {
			const res = await adminFetch<{ items?: Skill[] } | Skill[]>('/api/v1/skills')
			if (res.data) {
				const items = Array.isArray(res.data) ? res.data : (res.data.items || [])
				setSkills(items)
			}
		} catch (err) {
			console.error('Failed to load skills:', err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadSkills()
	}, [])

	const handleSave = async (formData: Partial<Skill>) => {
		if (editingSkill?.id) {
			await adminFetch(`/api/v1/skills/${editingSkill.id}`, {
				method: 'PATCH',
				body: JSON.stringify(formData),
			})
		} else {
			await adminFetch('/api/v1/skills', {
				method: 'POST',
				body: JSON.stringify(formData),
			})
		}
		await loadSkills()
	}

	const handleDelete = async (item: Skill) => {
		await adminFetch(`/api/v1/skills/${item.id}`, { method: 'DELETE' })
		setSkills(prev => prev.filter(s => s.id !== item.id))
	}

	const handleTogglePublish = async (item: Skill) => {
		const nextStatus = item.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
		await adminFetch(`/api/v1/skills/${item.id}/publish`, { method: 'PATCH' })
		setSkills(prev => prev.map(s => (s.id === item.id ? { ...s, status: nextStatus } : s)))
	}

	const columns: ColumnDef<Skill>[] = [
		{
			key: 'name',
			header: 'Skill & Category',
			render: sk => (
				<div className='flex items-center gap-3'>
					<div className='size-8 rounded-lg bg-surface-strong border border-border grid place-items-center shrink-0'>
						<Zap className='size-4 text-signal-ink' />
					</div>
					<div>
						<div className='flex items-center gap-2'>
							<span className='font-semibold text-foreground'>{sk.name}</span>
							{sk.featured && <Badge variant='signal'>Featured</Badge>}
						</div>
						<p className='text-xs text-muted-foreground'>{sk.category}</p>
					</div>
				</div>
			),
		},
		{
			key: 'proficiency',
			header: 'Proficiency',
			render: sk => (
				<div className='flex items-center gap-2 max-w-[120px]'>
					<div className='h-1.5 flex-1 bg-surface-strong rounded-full overflow-hidden'>
						<div
							className='h-full bg-signal rounded-full'
							style={{ width: `${sk.proficiency || 90}%` }}
						/>
					</div>
					<span className='font-mono text-[0.6875rem] text-muted-foreground'>
						{sk.proficiency || 90}%
					</span>
				</div>
			),
		},
		{
			key: 'status',
			header: 'Status',
			render: sk => (
				<Badge variant={sk.status === 'PUBLISHED' ? 'success' : 'warning'}>{sk.status}</Badge>
			),
		},
	]

	return (
		<div>
			<CollectionManager
				title='Technical Skills &amp; Stack Clusters'
				description='Manage technology proficiencies, categories, and homepage ticker highlights.'
				items={skills}
				columns={columns}
				loading={loading}
				searchKey={s => `${s.name} ${s.category}`}
				createLabel='Add Skill'
				onCreate={() => {
					setEditingSkill(null)
					setModalOpen(true)
				}}
				onEdit={item => {
					setEditingSkill(item)
					setModalOpen(true)
				}}
				onDelete={handleDelete}
				onTogglePublish={handleTogglePublish}
			/>

			<SkillModal
				open={modalOpen}
				onOpenChange={setModalOpen}
				skill={editingSkill}
				onSave={handleSave}
			/>
		</div>
	)
}
