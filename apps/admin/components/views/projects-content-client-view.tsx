'use client'

import { useEffect, useState } from 'react'
import { FolderKanban, Image as ImageIcon } from '@/components/icons'
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
import { MediaPickerModal } from '@/components/cms/media-picker-modal'
import { adminFetch } from '@/lib/api-client'
import { saveProjectAction, deleteProjectAction } from '@/actions/server/admin-server-actions'

export type Project = {
	id: string
	title: string
	slug: string
	shortDescription?: string
	summary?: string
	content?: string
	caseStudy?: string
	projectType?: string
	category?: string
	technologies: string[]
	repoUrl?: string | null
	liveUrl?: string | null
	coverImageUrl?: string | null
	featured: boolean
	status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
	gallery?: Array<{ id: string; url: string; caption?: string | null }>
	updatedAt?: string
}

export const ProjectEditorModal = ({
	open,
	onOpenChange,
	project,
	onSave,
}: {
	open: boolean
	onOpenChange: (v: boolean) => void
	project: Partial<Project> | null
	onSave: (p: Partial<Project>) => Promise<void>
}) => {
	const [formData, setFormData] = useState<Partial<Project>>({
		title: '',
		slug: '',
		shortDescription: '',
		projectType: 'Web Application',
		technologies: [],
		repoUrl: '',
		liveUrl: '',
		featured: false,
		status: 'PUBLISHED',
	})
	const [techInput, setTechInput] = useState('')
	const [mediaModalOpen, setMediaModalOpen] = useState(false)
	const [saving, setSaving] = useState(false)

	useEffect(() => {
		if (project) {
			setFormData({
				...project,
				technologies: Array.isArray(project.technologies) ? project.technologies : [],
			})
		} else {
			setFormData({
				title: '',
				slug: '',
				shortDescription: '',
				projectType: 'Web Application',
				technologies: ['React', 'Next.js', 'TypeScript', 'PostgreSQL'],
				repoUrl: '',
				liveUrl: '',
				featured: false,
				status: 'PUBLISHED',
			})
		}
	}, [project])

	const addTechnology = () => {
		if (!techInput.trim()) return
		setFormData(prev => ({
			...prev,
			technologies: [...(prev.technologies || []), techInput.trim()],
		}))
		setTechInput('')
	}

	const removeTechnology = (index: number) => {
		setFormData(prev => ({
			...prev,
			technologies: (prev.technologies || []).filter((_, i) => i !== index),
		}))
	}

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
			<DialogContent
				className='max-w-2xl max-h-[88vh] flex flex-col p-6'
				onClose={() => onOpenChange(false)}>
				<DialogHeader>
					<DialogTitle>{project?.id ? 'Edit Project' : 'Create New Project'}</DialogTitle>
					<DialogDescription>
						Configure project metadata, technologies, and deployment links.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className='flex-1 overflow-y-auto space-y-4 pr-1'>
					<div className='grid gap-4 sm:grid-cols-2'>
						<div className='space-y-1'>
							<Label className='text-xs'>Title</Label>
							<Input
								value={formData.title || ''}
								onChange={e => {
									const title = e.target.value
									setFormData(prev => ({
										...prev,
										title,
										slug:
											prev.slug ||
											title
												.toLowerCase()
												.replace(/[^a-z0-9]+/g, '-')
												.replace(/(^-|-$)/g, ''),
									}))
								}}
								required
								placeholder='e.g. ExpenseWise'
							/>
						</div>
						<div className='space-y-1'>
							<Label className='text-xs'>Slug</Label>
							<Input
								value={formData.slug || ''}
								onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
								required
								placeholder='expensewise'
							/>
						</div>
					</div>

					<div className='space-y-1'>
						<Label className='text-xs'>Short Summary</Label>
						<Input
							value={formData.shortDescription || ''}
							onChange={e => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
							placeholder='One sentence high-level summary…'
						/>
					</div>

					<div className='space-y-1'>
						<Label className='text-xs'>Case Study Narrative</Label>
						<Textarea
							value={formData.content || formData.caseStudy || ''}
							onChange={e =>
								setFormData(prev => ({
									...prev,
									content: e.target.value,
									caseStudy: e.target.value,
								}))
							}
							rows={4}
							placeholder='Architectural overview, key engineering decisions, throughput metrics…'
						/>
					</div>

					{/* Technologies Tags */}
					<div className='space-y-2'>
						<Label className='text-xs'>Tech Stack</Label>
						<div className='flex flex-wrap gap-1.5'>
							{(formData.technologies || []).map((t, idx) => (
								<Badge key={`t-${idx}`} variant='secondary' className='gap-1 pr-1'>
									<span>{t}</span>
									<button
										type='button'
										onClick={() => removeTechnology(idx)}
										className='text-muted-foreground hover:text-destructive'>
										×
									</button>
								</Badge>
							))}
						</div>
						<div className='flex gap-2'>
							<Input
								value={techInput}
								onChange={e => setTechInput(e.target.value)}
								onKeyDown={e => {
									if (e.key === 'Enter') {
										e.preventDefault()
										addTechnology()
									}
								}}
								placeholder='Add technology tag (e.g. Docker, PostgreSQL)…'
								className='h-8 text-xs'
							/>
							<Button type='button' variant='outline' size='sm' onClick={addTechnology}>
								Add
							</Button>
						</div>
					</div>

					{/* URLs */}
					<div className='grid gap-4 sm:grid-cols-2'>
						<div className='space-y-1'>
							<Label className='text-xs'>GitHub Repository</Label>
							<Input
								value={formData.repoUrl || ''}
								onChange={e => setFormData(prev => ({ ...prev, repoUrl: e.target.value }))}
								placeholder='https://github.com/…'
							/>
						</div>
						<div className='space-y-1'>
							<Label className='text-xs'>Live Production URL</Label>
							<Input
								value={formData.liveUrl || ''}
								onChange={e => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
								placeholder='https://…'
							/>
						</div>
					</div>

					{/* Cover Visual */}
					<div className='space-y-2'>
						<Label className='text-xs'>Cover Visual</Label>
						<div className='flex items-center gap-3'>
							<div className='size-14 rounded-lg bg-surface-strong border border-border overflow-hidden grid place-items-center'>
								{formData.coverImageUrl ? (
									/* eslint-disable-next-line @next/next/no-img-element */
									<img
										src={formData.coverImageUrl}
										alt='Cover'
										className='size-full object-cover'
									/>
								) : (
									<ImageIcon className='size-5 text-muted-foreground/40' />
								)}
							</div>
							<Button
								type='button'
								variant='outline'
								size='sm'
								onClick={() => setMediaModalOpen(true)}>
								Select Cover from S3
							</Button>
						</div>
					</div>

					{/* Status & Featured */}
					<div className='flex items-center justify-between pt-2 border-t border-border'>
						<label className='flex items-center gap-2 text-xs font-medium cursor-pointer'>
							<input
								type='checkbox'
								checked={Boolean(formData.featured)}
								onChange={e => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
								className='rounded border-border text-signal focus:ring-signal'
							/>
							<span>Feature on Homepage</span>
						</label>

						<div className='flex items-center gap-2'>
							<Label className='text-xs'>Status:</Label>
							<select
								value={formData.status || 'PUBLISHED'}
								onChange={e =>
									setFormData(prev => ({
										...prev,
										status: e.target.value as Project['status'],
									}))
								}
								className='h-8 rounded-lg border border-border bg-surface px-2.5 font-mono text-xs'>
								<option value='PUBLISHED'>PUBLISHED</option>
								<option value='DRAFT'>DRAFT</option>
								<option value='ARCHIVED'>ARCHIVED</option>
							</select>
						</div>
					</div>

					<DialogFooter>
						<Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
							Cancel
						</Button>
						<Button type='submit' variant='signal' disabled={saving}>
							{saving ? 'Saving…' : 'Save Project'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>

			<MediaPickerModal
				open={mediaModalOpen}
				onOpenChange={setMediaModalOpen}
				title='Select Project Cover'
				onSelect={media => setFormData(prev => ({ ...prev, coverImageUrl: media.url }))}
			/>
		</Dialog>
	)
}

export const ProjectsContentClientView = () => {
	const [projects, setProjects] = useState<Project[]>([])
	const [loading, setLoading] = useState(true)
	const [modalOpen, setModalOpen] = useState(false)
	const [editingProject, setEditingProject] = useState<Project | null>(null)

	const loadProjects = async () => {
		setLoading(true)
		try {
			const res = await adminFetch<{ items?: Project[] } | Project[]>('/api/v1/projects')
			if (res.data) {
				const items = Array.isArray(res.data) ? res.data : (res.data.items || [])
				setProjects(items)
			}
		} catch (err) {
			console.error('Failed to load projects:', err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadProjects()
	}, [])

	const handleSave = async (formData: Partial<Project>) => {
		await saveProjectAction(editingProject?.id, formData as any)
		await loadProjects()
	}

	const handleDelete = async (item: Project) => {
		await deleteProjectAction(item.id)
		setProjects(prev => prev.filter(p => p.id !== item.id))
	}

	const handleTogglePublish = async (item: Project) => {
		const nextStatus = item.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
		await adminFetch(`/api/v1/projects/${item.id}/publish`, { method: 'PATCH' })
		setProjects(prev => prev.map(p => (p.id === item.id ? { ...p, status: nextStatus } : p)))
	}

	const columns: ColumnDef<Project>[] = [
		{
			key: 'title',
			header: 'Project Details',
			render: p => (
				<div className='flex items-center gap-3'>
					<div className='size-10 rounded-lg bg-surface-strong border border-border overflow-hidden grid place-items-center shrink-0'>
						{p.coverImageUrl ? (
							/* eslint-disable-next-line @next/next/no-img-element */
							<img src={p.coverImageUrl} alt={p.title} className='size-full object-cover' />
						) : (
							<FolderKanban className='size-4 text-muted-foreground' />
						)}
					</div>
					<div className='min-w-0'>
						<div className='flex items-center gap-2'>
							<span className='font-semibold text-foreground truncate'>{p.title}</span>
							{p.featured && <Badge variant='signal'>Featured</Badge>}
						</div>
						<p className='truncate text-xs text-muted-foreground'>/{p.slug}</p>
					</div>
				</div>
			),
		},
		{
			key: 'technologies',
			header: 'Technologies',
			render: p => (
				<div className='flex flex-wrap gap-1 max-w-xs'>
					{(p.technologies || []).slice(0, 3).map((t, idx) => (
						<Badge key={idx} variant='secondary' className='text-[0.625rem]'>
							{t}
						</Badge>
					))}
					{(p.technologies || []).length > 3 && (
						<span className='text-[0.625rem] text-muted-foreground font-mono'>
							+{(p.technologies || []).length - 3}
						</span>
					)}
				</div>
			),
		},
		{
			key: 'status',
			header: 'Status',
			render: p => (
				<Badge
					variant={
						p.status === 'PUBLISHED' ? 'success' : p.status === 'DRAFT' ? 'warning' : 'secondary'
					}>
					{p.status}
				</Badge>
			),
		},
	]

	return (
		<div>
			<CollectionManager
				title='Projects &amp; Case Studies'
				description='Manage production showcases, case study narratives, technology badges, and deployment links.'
				items={projects}
				columns={columns}
				loading={loading}
				searchKey={p => `${p.title} ${p.slug} ${(p.technologies || []).join(' ')}`}
				createLabel='New Project'
				onCreate={() => {
					setEditingProject(null)
					setModalOpen(true)
				}}
				onEdit={item => {
					setEditingProject(item)
					setModalOpen(true)
				}}
				onDelete={handleDelete}
				onTogglePublish={handleTogglePublish}
			/>

			<ProjectEditorModal
				open={modalOpen}
				onOpenChange={setModalOpen}
				project={editingProject}
				onSave={handleSave}
			/>
		</div>
	)
}
