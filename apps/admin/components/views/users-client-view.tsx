'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from 'ui/designs/data-table'
import { adminFetch } from '@/lib/api-client'
import { createUserAction, updateUserAction, deleteUserAction } from '@/actions/server/admin-server-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { ConfirmDialog } from '@/components/cms/confirm-dialog'
import { Plus, RefreshCw, Pencil, Trash2, Search } from '@/components/icons'
import { useFormReducer } from 'utils/useFormReducer'
import { z } from 'zod'

export type AdminUser = {
	id: string
	email: string
	displayName?: string
	name?: string
	firstName?: string
	lastName?: string
	role: 'ADMIN' | 'EDITOR' | 'USER'
	status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
	provider?: string
	lastLoginAt?: string | null
	createdAt: string
}

const createUserSchema = z.object({
	fullName: z.string().min(2, 'Full name is required'),
	email: z.string().email('Valid email is required'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
	role: z.enum(['ADMIN', 'EDITOR', 'USER']),
	status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
})

type CreateUserFormValues = z.infer<typeof createUserSchema>

export const UsersClientView = () => {
	const [users, setUsers] = useState<AdminUser[]>([])
	const [loading, setLoading] = useState(true)
	const [search, setSearch] = useState('')
	const [roleFilter, setRoleFilter] = useState('ALL')

	// Create User Modal
	const [isCreateOpen, setIsCreateOpen] = useState(false)

	// Edit User Modal
	const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
	const [editRole, setEditRole] = useState<'ADMIN' | 'EDITOR' | 'USER'>('EDITOR')
	const [editStatus, setEditStatus] = useState<'ACTIVE' | 'INACTIVE' | 'SUSPENDED'>('ACTIVE')
	const [isUpdating, setIsUpdating] = useState(false)

	// Delete Confirmation
	const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null)
	const [isDeleting, setIsDeleting] = useState(false)

	const loadUsers = useCallback(async () => {
		setLoading(true)
		try {
			const query = new URLSearchParams()
			if (search) query.set('search', search)
			if (roleFilter !== 'ALL') query.set('role', roleFilter)

			const res = await adminFetch<{ items?: AdminUser[] } | AdminUser[]>(
				`/api/v1/users?${query.toString()}`,
			)
			if (res.data) {
				const list = Array.isArray(res.data)
					? res.data
					: ('items' in res.data && Array.isArray(res.data.items)
						? res.data.items
						: [])
				setUsers(list)
			}
		} catch (err) {
			console.error('Failed to load users:', err)
		} finally {
			setLoading(false)
		}
	}, [search, roleFilter])

	useEffect(() => {
		loadUsers()
	}, [loadUsers])

	const createForm = useFormReducer<CreateUserFormValues>({
		initialValues: {
			fullName: '',
			email: '',
			password: '',
			role: 'EDITOR',
			status: 'ACTIVE',
		},
		schema: createUserSchema,
		onSubmit: async values => {
			const res = await createUserAction(values)
			if (res.data) {
				const createdUser = res.data
				setUsers(prev => [createdUser, ...prev])
				setIsCreateOpen(false)
				createForm.reset()
			} else if (res.error) {
				throw new Error(res.error)
			}
		},
	})

	const handleUpdate = async () => {
		if (!selectedUser) return
		setIsUpdating(true)
		try {
			const res = await updateUserAction(selectedUser.id, {
				role: editRole,
				status: editStatus,
			})
			if (res.data) {
				setUsers(prev =>
					prev.map(u =>
						u.id === selectedUser.id ? { ...u, role: editRole, status: editStatus } : u,
					),
				)
				setSelectedUser(null)
			}
		} catch (err) {
			console.error('Failed to update user:', err)
		} finally {
			setIsUpdating(false)
		}
	}

	const handleDelete = async () => {
		if (!userToDelete) return
		setIsDeleting(true)
		try {
			await deleteUserAction(userToDelete.id)
			setUsers(prev => prev.filter(u => u.id !== userToDelete.id))
			setUserToDelete(null)
		} catch (err) {
			console.error('Failed to delete user:', err)
		} finally {
			setIsDeleting(false)
		}
	}

	const getRoleBadge = (role: string) => {
		switch (role) {
			case 'ADMIN':
				return <Badge variant='signal'>ADMIN</Badge>
			case 'EDITOR':
				return <Badge variant='secondary'>EDITOR</Badge>
			default:
				return <Badge variant='outline'>USER</Badge>
		}
	}

	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'ACTIVE':
				return <Badge variant='success'>ACTIVE</Badge>
			case 'INACTIVE':
				return <Badge variant='warning'>INACTIVE</Badge>
			case 'SUSPENDED':
				return <Badge variant='destructive'>SUSPENDED</Badge>
			default:
				return <Badge variant='outline'>{status}</Badge>
		}
	}

	const adminCount = users.filter(u => u.role === 'ADMIN').length
	const editorCount = users.filter(u => u.role === 'EDITOR').length
	const activeCount = users.filter(u => u.status === 'ACTIVE').length

	const columns = useMemo<ColumnDef<AdminUser>[]>(
		() => [
			{
				accessorKey: 'displayName',
				header: 'User',
				cell: ({ row }) => {
					const u = row.original
					const displayName =
						u.displayName ||
						u.name ||
						(u.firstName ? `${u.firstName} ${u.lastName || ''}`.trim() : u.email.split('@')[0]) ||
						'User'
					return (
						<div className='flex items-center gap-3'>
							<div className='flex size-9 items-center justify-center rounded-full bg-signal-ink/10 font-semibold text-signal-ink text-xs shrink-0'>
								{displayName[0]?.toUpperCase() || 'U'}
							</div>
							<div>
								<p className='font-medium text-foreground'>{displayName}</p>
								<p className='text-xs text-muted-foreground'>{u.email}</p>
							</div>
						</div>
					)
				},
			},
			{
				accessorKey: 'role',
				header: 'Role',
				cell: ({ row }) => getRoleBadge(row.original.role),
			},
			{
				accessorKey: 'status',
				header: 'Status',
				cell: ({ row }) => getStatusBadge(row.original.status),
			},
			{
				accessorKey: 'provider',
				header: 'Provider',
				cell: ({ row }) => (
					<span className='text-xs text-muted-foreground capitalize'>
						{row.original.provider?.toLowerCase() || 'Firebase'}
					</span>
				),
			},
			{
				accessorKey: 'createdAt',
				header: 'Joined Date',
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
				cell: ({ row }) => {
					const u = row.original
					return (
						<div className='flex items-center justify-end gap-1'>
							<Button
								variant='ghost'
								size='icon'
								onClick={() => {
									setSelectedUser(u)
									setEditRole(u.role)
									setEditStatus(u.status)
								}}>
								<Pencil className='size-4' />
							</Button>
							<Button
								variant='ghost'
								size='icon'
								onClick={() => setUserToDelete(u)}
								className='text-destructive hover:text-destructive hover:bg-destructive/10'>
								<Trash2 className='size-4' />
							</Button>
						</div>
					)
				},
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
						Users & Access Control
					</h1>
					<p className='text-sm text-muted-foreground'>
						Manage authenticated administrative personnel, granular RBAC roles, and security permissions.
					</p>
				</div>
				<div className='flex items-center gap-2'>
					<Button variant='outline' size='sm' onClick={loadUsers} disabled={loading}>
						<RefreshCw className={`size-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
						Refresh
					</Button>
					<Button variant='signal' size='sm' onClick={() => setIsCreateOpen(true)}>
						<Plus className='size-4 mr-1.5' />
						Add Personnel
					</Button>
				</div>
			</div>

			{/* Metrics Ribbon */}
			<div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
				<div className='rounded-2xl border border-border bg-surface p-5 space-y-1.5 shadow-xs'>
					<p className='font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
						Total Personnel
					</p>
					<p className='font-display text-3xl font-bold text-foreground'>{users.length}</p>
				</div>
				<div className='rounded-2xl border border-border bg-surface p-5 space-y-1.5 shadow-xs'>
					<p className='font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
						Administrators
					</p>
					<p className='font-display text-3xl font-bold text-signal-ink'>{adminCount}</p>
				</div>
				<div className='rounded-2xl border border-border bg-surface p-5 space-y-1.5 shadow-xs'>
					<p className='font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
						Content Editors
					</p>
					<p className='font-display text-3xl font-bold text-blue-500'>{editorCount}</p>
				</div>
				<div className='rounded-2xl border border-border bg-surface p-5 space-y-1.5 shadow-xs'>
					<p className='font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
						Active Accounts
					</p>
					<p className='font-display text-3xl font-bold text-emerald-500'>{activeCount}</p>
				</div>
			</div>

			{/* Filter Toolbar */}
			<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border bg-surface/60 p-3'>
				<div className='relative flex-1 max-w-sm'>
					<Search className='size-4 text-muted-foreground absolute left-3 top-2.5' />
					<Input
						placeholder='Search personnel by name or email address…'
						value={search}
						onChange={e => setSearch(e.target.value)}
						className='pl-9 h-9'
					/>
				</div>
				<div className='flex flex-wrap items-center gap-2 font-mono text-xs'>
					<div className='flex items-center gap-1.5 overflow-x-auto'>
						{(['ALL', 'ADMIN', 'EDITOR', 'USER'] as const).map(r => (
							<button
								key={r}
								type='button'
								onClick={() => setRoleFilter(r)}
								className={`rounded-lg px-2.5 py-1 transition-colors cursor-pointer ${
									roleFilter === r
										? 'bg-primary text-primary-foreground font-semibold shadow-xs'
										: 'text-muted-foreground hover:bg-accent hover:text-foreground'
								}`}>
								{r}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Data Table */}
			<DataTable
				columns={columns}
				data={users}
				loading={loading}
				totalCount={users.length}
				pageSize={10}
				disableDateRange
				disableSearch
			/>

			{/* Create User Modal */}
			<Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
				<DialogContent
					className='max-w-md flex flex-col p-6'
					onClose={() => setIsCreateOpen(false)}>
					<DialogHeader>
						<DialogTitle>Create Personnel / Admin Account</DialogTitle>
						<DialogDescription>
							Add a new administrator or content editor to manage the CMS.
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={createForm.handleSubmit} className='space-y-4 pt-2'>
						{createForm.submitError && (
							<div className='rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive'>
								{createForm.submitError}
							</div>
						)}

						<div className='space-y-1.5'>
							<label htmlFor='user-fullname' className='text-xs font-medium text-foreground'>
								Full Name
							</label>
							<Input
								id='user-fullname'
								required
								placeholder='e.g. Alex Morgan'
								value={createForm.values.fullName}
								onChange={e => createForm.handleChange('fullName', e.target.value)}
								onBlur={() => createForm.handleBlur('fullName')}
							/>
							{createForm.errors.fullName && (
								<p className='text-xs text-destructive'>{createForm.errors.fullName}</p>
							)}
						</div>

						<div className='space-y-1.5'>
							<label htmlFor='user-email' className='text-xs font-medium text-foreground'>
								Email Address
							</label>
							<Input
								id='user-email'
								required
								type='email'
								placeholder='user@example.com'
								value={createForm.values.email}
								onChange={e => createForm.handleChange('email', e.target.value)}
								onBlur={() => createForm.handleBlur('email')}
							/>
							{createForm.errors.email && (
								<p className='text-xs text-destructive'>{createForm.errors.email}</p>
							)}
						</div>

						<div className='space-y-1.5'>
							<label htmlFor='user-password' className='text-xs font-medium text-foreground'>
								Initial Password
							</label>
							<Input
								id='user-password'
								required
								type='password'
								placeholder='Min 6 characters'
								value={createForm.values.password}
								onChange={e => createForm.handleChange('password', e.target.value)}
								onBlur={() => createForm.handleBlur('password')}
							/>
							{createForm.errors.password && (
								<p className='text-xs text-destructive'>{createForm.errors.password}</p>
							)}
						</div>

						<div className='grid grid-cols-2 gap-4'>
							<div className='space-y-1.5'>
								<label htmlFor='user-role' className='text-xs font-medium text-foreground'>
									Role
								</label>
								<select
									id='user-role'
									aria-label='User role'
									value={createForm.values.role}
									onChange={e =>
										createForm.handleChange(
											'role',
											e.target.value as 'ADMIN' | 'EDITOR' | 'USER',
										)
									}
									className='w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-signal-ink'>
									<option value='ADMIN'>ADMIN</option>
									<option value='EDITOR'>EDITOR</option>
									<option value='USER'>USER</option>
								</select>
							</div>

							<div className='space-y-1.5'>
								<label htmlFor='user-status' className='text-xs font-medium text-foreground'>
									Status
								</label>
								<select
									id='user-status'
									aria-label='User status'
									value={createForm.values.status}
									onChange={e =>
										createForm.handleChange(
											'status',
											e.target.value as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
										)
									}
									className='w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-signal-ink'>
									<option value='ACTIVE'>ACTIVE</option>
									<option value='INACTIVE'>INACTIVE</option>
									<option value='SUSPENDED'>SUSPENDED</option>
								</select>
							</div>
						</div>

						<div className='flex justify-end gap-2 pt-2'>
							<Button
								type='button'
								variant='outline'
								size='sm'
								onClick={() => setIsCreateOpen(false)}>
								Cancel
							</Button>
							<Button type='submit' variant='signal' size='sm' disabled={createForm.isSubmitting}>
								{createForm.isSubmitting ? 'Creating...' : 'Create Personnel'}
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>

			{/* Edit User Modal */}
			<Dialog open={!!selectedUser} onOpenChange={open => !open && setSelectedUser(null)}>
				<DialogContent
					className='max-w-md flex flex-col p-6'
					onClose={() => setSelectedUser(null)}>
					<DialogHeader>
						<DialogTitle>Modify Role & Permissions</DialogTitle>
						<DialogDescription>{`Update RBAC and account state for ${selectedUser?.email}`}</DialogDescription>
					</DialogHeader>

					{selectedUser && (
						<div className='space-y-4 pt-2'>
							<div className='space-y-1.5'>
								<label htmlFor='edit-user-role' className='text-xs font-medium text-foreground'>
									Role Authorization
								</label>
								<select
									id='edit-user-role'
									aria-label='Edit user role'
									value={editRole}
									onChange={e => setEditRole(e.target.value as 'ADMIN' | 'EDITOR' | 'USER')}
									className='w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-signal-ink'>
									<option value='ADMIN'>
										ADMIN — Full destructive & administrative authority
									</option>
									<option value='EDITOR'>EDITOR — Content authoring and media publishing</option>
									<option value='USER'>USER — Read-only authenticated profile</option>
								</select>
							</div>

							<div className='space-y-1.5'>
								<label htmlFor='edit-user-status' className='text-xs font-medium text-foreground'>
									Account Status
								</label>
								<select
									id='edit-user-status'
									aria-label='Edit user status'
									value={editStatus}
									onChange={e =>
										setEditStatus(e.target.value as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED')
									}
									className='w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-signal-ink'>
									<option value='ACTIVE'>ACTIVE — Normal operational state</option>
									<option value='INACTIVE'>INACTIVE — Temporary suspension</option>
									<option value='SUSPENDED'>SUSPENDED — Locked account</option>
								</select>
							</div>

							<div className='flex justify-end gap-2 pt-2'>
								<Button variant='outline' size='sm' onClick={() => setSelectedUser(null)}>
									Cancel
								</Button>
								<Button variant='signal' size='sm' onClick={handleUpdate} disabled={isUpdating}>
									{isUpdating ? 'Saving...' : 'Save Permissions'}
								</Button>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>

			{/* Confirm Deletion Dialog */}
			<ConfirmDialog
				open={!!userToDelete}
				onOpenChange={open => !open && setUserToDelete(null)}
				onConfirm={handleDelete}
				title='Revoke Personnel Access?'
				description={`Are you sure you want to revoke and delete the account for ${userToDelete?.email}? This will invalidate all active sessions immediately.`}
				confirmLabel='Revoke & Delete'
				loading={isDeleting}
			/>
		</div>
	)
}
