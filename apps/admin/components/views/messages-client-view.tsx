'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from 'ui/designs/data-table'
import { adminFetch } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { ConfirmDialog } from '@/components/cms/confirm-dialog'
import {
	RefreshCw,
	Trash2,
	CheckCircle2,
	Eye,
	Search,
} from '@/components/icons'

export type ContactMessage = {
	id: string
	name: string
	email: string
	subject: string
	message: string
	url?: string | null
	source?: string | null
	status: 'UNREAD' | 'READ' | 'RESOLVED' | 'ARCHIVED' | 'SPAM'
	priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
	internalNotes?: string | null
	ipAddress?: string | null
	userAgent?: string | null
	createdAt: string
	updatedAt: string
}

export const MessagesClientView = () => {
	const [messages, setMessages] = useState<ContactMessage[]>([])
	const [loading, setLoading] = useState(true)
	const [search, setSearch] = useState('')
	const [statusFilter, setStatusFilter] = useState<string>('ALL')
	const [priorityFilter, setPriorityFilter] = useState<string>('ALL')

	// Message detail modal
	const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
	const [notes, setNotes] = useState('')
	const [status, setStatus] = useState<string>('')
	const [priority, setPriority] = useState<string>('')
	const [isUpdating, setIsUpdating] = useState(false)
	const [saveSuccess, setSaveSuccess] = useState(false)

	// Delete confirmation
	const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(null)
	const [isDeleting, setIsDeleting] = useState(false)

	const loadMessages = useCallback(async () => {
		setLoading(true)
		try {
			const query = new URLSearchParams({ limit: '100' })
			if (search) query.set('search', search)
			if (statusFilter !== 'ALL') query.set('status', statusFilter)
			if (priorityFilter !== 'ALL') query.set('priority', priorityFilter)

			const res = await adminFetch<{ items?: ContactMessage[] } | ContactMessage[]>(
				`/api/v1/contacts?${query.toString()}`,
			)
			if (res.data) {
				const list = Array.isArray(res.data) ? res.data : (res.data.items || [])
				setMessages(list)
			}
		} catch (err) {
			console.error('Failed to load messages:', err)
		} finally {
			setLoading(false)
		}
	}, [search, statusFilter, priorityFilter])

	useEffect(() => {
		loadMessages()
	}, [loadMessages])

	const openMessageModal = (msg: ContactMessage) => {
		setSelectedMessage(msg)
		setNotes(msg.internalNotes || '')
		setStatus(msg.status)
		setPriority(msg.priority)
		setSaveSuccess(false)

		if (msg.status === 'UNREAD') {
			adminFetch(`/api/v1/contacts/${msg.id}`, {
				method: 'PATCH',
				body: JSON.stringify({ status: 'READ' }),
			})
				.then(() => {
					setMessages(prev => prev.map(m => (m.id === msg.id ? { ...m, status: 'READ' } : m)))
					setStatus('READ')
				})
				.catch(console.error)
		}
	}

	const handleSaveChanges = async () => {
		if (!selectedMessage) return
		setIsUpdating(true)
		setSaveSuccess(false)
		try {
			const res = await adminFetch<ContactMessage>(`/api/v1/contacts/${selectedMessage.id}`, {
				method: 'PATCH',
				body: JSON.stringify({
					internalNotes: notes,
					status,
					priority,
				}),
			})
			if (res.data) {
				setMessages(prev =>
					prev.map(m => (m.id === selectedMessage.id ? { ...m, ...res.data } : m)),
				)
				setSelectedMessage(prev => (prev ? { ...prev, ...res.data } : null))
				setSaveSuccess(true)
				setTimeout(() => setSaveSuccess(false), 3000)
			}
		} catch (err) {
			console.error('Failed to update message:', err)
		} finally {
			setIsUpdating(false)
		}
	}

	const handleDelete = async () => {
		if (!messageToDelete) return
		setIsDeleting(true)
		try {
			await adminFetch(`/api/v1/contacts/${messageToDelete.id}`, {
				method: 'DELETE',
			})
			setMessages(prev => prev.filter(m => m.id !== messageToDelete.id))
			if (selectedMessage?.id === messageToDelete.id) {
				setSelectedMessage(null)
			}
			setMessageToDelete(null)
		} catch (err) {
			console.error('Failed to delete message:', err)
		} finally {
			setIsDeleting(false)
		}
	}

	const unreadCount = messages.filter(m => m.status === 'UNREAD').length
	const urgentCount = messages.filter(m => m.priority === 'HIGH' || m.priority === 'URGENT').length
	const resolvedCount = messages.filter(m => m.status === 'RESOLVED').length

	const getPriorityBadge = (p: string) => {
		switch (p) {
			case 'URGENT':
				return <Badge variant='destructive'>Urgent</Badge>
			case 'HIGH':
				return <Badge variant='warning'>High</Badge>
			case 'NORMAL':
				return <Badge variant='secondary'>Normal</Badge>
			case 'LOW':
				return <Badge variant='outline'>Low</Badge>
			default:
				return <Badge variant='outline'>{p}</Badge>
		}
	}

	const getStatusBadge = (s: string) => {
		switch (s) {
			case 'UNREAD':
				return <Badge variant='signal'>Unread</Badge>
			case 'READ':
				return <Badge variant='secondary'>Read</Badge>
			case 'RESOLVED':
				return <Badge variant='success'>Resolved</Badge>
			case 'SPAM':
				return <Badge variant='destructive'>Spam</Badge>
			case 'ARCHIVED':
				return <Badge variant='outline'>Archived</Badge>
			default:
				return <Badge variant='outline'>{s}</Badge>
		}
	}

	const columns = useMemo<ColumnDef<ContactMessage>[]>(
		() => [
			{
				accessorKey: 'name',
				header: 'Sender',
				cell: ({ row }) => {
					const msg = row.original
					return (
						<div className='flex items-center gap-2.5'>
							{msg.status === 'UNREAD' && (
								<span className='h-2 w-2 rounded-full bg-signal-ink shrink-0' />
							)}
							<div>
								<p className='font-medium text-foreground'>{msg.name}</p>
								<p className='text-xs text-muted-foreground'>{msg.email}</p>
							</div>
						</div>
					)
				},
			},
			{
				accessorKey: 'subject',
				header: 'Subject & Message',
				cell: ({ row }) => (
					<div className='max-w-md'>
						<p className='font-medium text-foreground truncate'>{row.original.subject}</p>
						<p className='text-xs text-muted-foreground truncate'>{row.original.message}</p>
					</div>
				),
			},
			{
				accessorKey: 'priority',
				header: 'Priority',
				cell: ({ row }) => getPriorityBadge(row.original.priority),
			},
			{
				accessorKey: 'status',
				header: 'Status',
				cell: ({ row }) => getStatusBadge(row.original.status),
			},
			{
				accessorKey: 'createdAt',
				header: 'Date',
				cell: ({ row }) => (
					<span className='text-xs text-muted-foreground'>
						{new Date(row.original.createdAt).toLocaleDateString(undefined, {
							month: 'short',
							day: 'numeric',
							year: 'numeric',
						})}
					</span>
				),
			},
			{
				id: 'actions',
				header: () => <div className='text-right'>Actions</div>,
				cell: ({ row }) => (
					<div className='flex items-center justify-end gap-1'>
						<Button
							variant='ghost'
							size='sm'
							onClick={() => openMessageModal(row.original)}
							className='text-xs text-signal-ink hover:bg-signal-ink/10'>
							<Eye className='size-3.5 mr-1' />
							Inspect
						</Button>
						<Button
							variant='ghost'
							size='icon'
							onClick={() => setMessageToDelete(row.original)}
							className='text-destructive hover:bg-destructive/10'>
							<Trash2 className='size-4' />
						</Button>
					</div>
				),
			},
		],
		[],
	)

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h1 className='font-display text-2xl font-bold tracking-tight text-foreground'>
						Inquiries & Inbox
					</h1>
					<p className='text-sm text-muted-foreground'>
						Review and triage client contact requests, project inquiries, and feedback.
					</p>
				</div>
				<div className='flex items-center gap-2'>
					<Button variant='outline' size='sm' onClick={loadMessages} disabled={loading}>
						<RefreshCw className={`size-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
						Refresh
					</Button>
				</div>
			</div>

			{/* Metrics Ribbon */}
			<div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
				<div className='rounded-2xl border border-border bg-surface p-5 space-y-1.5 shadow-xs'>
					<p className='font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
						Total Submissions
					</p>
					<p className='font-display text-3xl font-bold text-foreground'>{messages.length}</p>
				</div>
				<div className='rounded-2xl border border-border bg-surface p-5 space-y-1.5 shadow-xs'>
					<div className='flex items-center justify-between'>
						<p className='font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
							Unread
						</p>
						{unreadCount > 0 && (
							<span className='h-2 w-2 rounded-full bg-signal-ink animate-pulse' />
						)}
					</div>
					<p className='font-display text-3xl font-bold text-signal-ink'>{unreadCount}</p>
				</div>
				<div className='rounded-2xl border border-border bg-surface p-5 space-y-1.5 shadow-xs'>
					<p className='font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
						High / Urgent
					</p>
					<p className='font-display text-3xl font-bold text-amber-500'>{urgentCount}</p>
				</div>
				<div className='rounded-2xl border border-border bg-surface p-5 space-y-1.5 shadow-xs'>
					<p className='font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
						Resolved
					</p>
					<p className='font-display text-3xl font-bold text-emerald-500'>{resolvedCount}</p>
				</div>
			</div>

			{/* Filter Toolbar */}
			<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border bg-surface/60 p-3'>
				<div className='relative flex-1 max-w-sm'>
					<Search className='size-4 text-muted-foreground absolute left-3 top-2.5' />
					<Input
						placeholder='Search messages by sender, email, or subject…'
						value={search}
						onChange={e => setSearch(e.target.value)}
						className='pl-9 h-9'
					/>
				</div>
				<div className='flex flex-wrap items-center gap-2 font-mono text-xs'>
					<div className='flex items-center gap-1.5 overflow-x-auto'>
						{(['ALL', 'UNREAD', 'READ', 'RESOLVED', 'ARCHIVED'] as const).map(tab => (
							<button
								key={tab}
								type='button'
								onClick={() => setStatusFilter(tab)}
								className={`rounded-lg px-2.5 py-1 transition-colors cursor-pointer ${
									statusFilter === tab
										? 'bg-primary text-primary-foreground font-semibold shadow-xs'
										: 'text-muted-foreground hover:bg-accent hover:text-foreground'
								}`}>
								{tab}
							</button>
						))}
					</div>

					<select
						aria-label='Filter inquiries by priority'
						value={priorityFilter}
						onChange={e => setPriorityFilter(e.target.value)}
						className='rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-signal-ink cursor-pointer'>
						<option value='ALL'>All Priorities</option>
						<option value='LOW'>Low</option>
						<option value='NORMAL'>Normal</option>
						<option value='HIGH'>High</option>
						<option value='URGENT'>Urgent</option>
					</select>
				</div>
			</div>

			{/* Data Table */}
			<DataTable
				columns={columns}
				data={messages}
				loading={loading}
				totalCount={messages.length}
				pageSize={10}
				disableDateRange
				disableSearch
			/>

			{/* Message Detail Modal */}
			<Dialog open={!!selectedMessage} onOpenChange={open => !open && setSelectedMessage(null)}>
				<DialogContent
					className='max-w-2xl flex flex-col p-6'
					onClose={() => setSelectedMessage(null)}>
					<DialogHeader>
						<DialogTitle>{selectedMessage?.subject || 'Contact Submission'}</DialogTitle>
						<DialogDescription>
							{`From ${selectedMessage?.name} (${selectedMessage?.email}) • ${selectedMessage?.createdAt ? new Date(selectedMessage.createdAt).toLocaleString() : ''}`}
						</DialogDescription>
					</DialogHeader>

					{selectedMessage && (
						<div className='space-y-4 pt-2'>
							<div className='rounded-xl border border-border bg-background p-4 space-y-2'>
								<p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
									Message Content
								</p>
								<p className='text-sm text-foreground whitespace-pre-wrap leading-relaxed'>
									{selectedMessage.message}
								</p>
							</div>

							<div className='grid grid-cols-2 gap-4'>
								<div className='space-y-1.5'>
									<label htmlFor='message-status' className='text-xs font-medium text-foreground'>
										Status
									</label>
									<select
										id='message-status'
										value={status}
										onChange={e => setStatus(e.target.value)}
										className='w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-signal-ink'>
										<option value='UNREAD'>UNREAD</option>
										<option value='READ'>READ</option>
										<option value='RESOLVED'>RESOLVED</option>
										<option value='ARCHIVED'>ARCHIVED</option>
										<option value='SPAM'>SPAM</option>
									</select>
								</div>

								<div className='space-y-1.5'>
									<label htmlFor='message-priority' className='text-xs font-medium text-foreground'>
										Priority
									</label>
									<select
										id='message-priority'
										value={priority}
										onChange={e => setPriority(e.target.value)}
										className='w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-signal-ink'>
										<option value='LOW'>LOW</option>
										<option value='NORMAL'>NORMAL</option>
										<option value='HIGH'>HIGH</option>
										<option value='URGENT'>URGENT</option>
									</select>
								</div>
							</div>

							<div className='space-y-1.5'>
								<label htmlFor='message-notes' className='text-xs font-medium text-foreground'>
									Internal Triage Notes
								</label>
								<Textarea
									id='message-notes'
									rows={3}
									placeholder='Add internal notes regarding resolution or follow-up...'
									value={notes}
									onChange={e => setNotes(e.target.value)}
								/>
							</div>

							<div className='flex items-center justify-between pt-2'>
								<Button
									type='button'
									variant='outline'
									size='sm'
									onClick={() => {
										setSelectedMessage(null)
										setMessageToDelete(selectedMessage)
									}}
									className='text-destructive hover:bg-destructive/10'>
									<Trash2 className='size-4 mr-1.5' />
									Delete Inquiry
								</Button>

								<div className='flex items-center gap-2'>
									{saveSuccess && (
										<span className='flex items-center gap-1 text-xs text-emerald-500 font-medium'>
											<CheckCircle2 className='size-4' /> Saved
										</span>
									)}
									<Button
										type='button'
										variant='signal'
										size='sm'
										onClick={handleSaveChanges}
										disabled={isUpdating}>
										{isUpdating ? 'Saving...' : 'Save Triage Status'}
									</Button>
								</div>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>

			{/* Confirm Deletion Dialog */}
			<ConfirmDialog
				open={!!messageToDelete}
				onOpenChange={open => !open && setMessageToDelete(null)}
				onConfirm={handleDelete}
				title='Delete Inquiry Record?'
				description={`Are you sure you want to permanently delete the inquiry from ${messageToDelete?.name}? This action cannot be undone.`}
				confirmLabel='Delete Inquiry'
				loading={isDeleting}
			/>
		</div>
	)
}
