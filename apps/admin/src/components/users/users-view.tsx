'use client'

import type { ListQueryOptions } from 'types/components/admin'
import type { UserRecord } from 'types/api'
import { useState, useMemo } from 'react'
import type { DataTableColumnDef, DataTableFilters } from 'types/components'
import { DataTable } from 'ui/designs/data-table'
import { Button } from 'ui/button'
import { IconButton } from 'ui/icon-button'
import { Badge } from 'components/ui/badge'
import { ConfirmDialog } from 'components/cms/confirm-dialog'
import { Plus, Pencil, Trash2 } from 'components/icons'
import { usersActions } from 'actions/users'
import { useServerList } from 'lib/use-server-list'
import { useAuth } from 'lib/auth'
import { UserEditDialog } from './user-edit-dialog'
import { UserCreateDialog } from './user-create-dialog'
import { CountCard } from 'components/cms/count-card'
import { PageHeader } from 'components/cms/page-header'
import { ErrorBanner } from 'components/ui/error-banner'
import { RefreshButton } from 'components/cms/refresh-button'

const listUsers = (query: URLSearchParams, signal: AbortSignal) =>
	usersActions.list<UserRecord>(query, signal)

const LIST_OPTIONS: ListQueryOptions = { sort: { name: 'displayName' }, filters: { role: 'role' } }

export const UsersView = () => {
	const { user: currentUser } = useAuth()
	const {
		data,
		items: users,
		total,
		loading,
		error,
		reload: loadUsers,
	} = useServerList(listUsers, LIST_OPTIONS)

	const [isCreateOpen, setIsCreateOpen] = useState(false)

	const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null)

	const [userToDelete, setUserToDelete] = useState<UserRecord | null>(null)
	const [isDeleting, setIsDeleting] = useState(false)

	const userFilters: DataTableFilters[] = [
		{
			id: 'role',
			label: 'Role',
			type: 'select',
			options: [
				{ label: 'All Roles', value: '' },
				{ label: 'Admin', value: 'ADMIN' },
				{ label: 'Editor', value: 'EDITOR' },
				{ label: 'User', value: 'USER' },
			],
		},
	]

	const handleDelete = async () => {
		if (!userToDelete) return
		setIsDeleting(true)
		try {
			const res = await usersActions.remove(userToDelete.id)
			if (res.error) throw new Error(res.error)
			await loadUsers()
			setUserToDelete(null)
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

	const counts = data && !Array.isArray(data) ? data : null
	const adminCount = counts?.adminCount ?? 0
	const editorCount = counts?.editorCount ?? 0
	const activeCount = counts?.activeCount ?? 0

	const columns = useMemo<DataTableColumnDef<UserRecord>[]>(
		() => [
			{
				accessorKey: 'name',
				enableSorting: true,
				header: 'User',
				cell: ({ row }) => {
					const u = row.original
					const displayName = u.name || u.email.split('@')[0] || 'User'
					return (
						<div className='flex items-center gap-3'>
							<div className='bg-signal-ink/10 text-signal-ink flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold'>
								{displayName[0]?.toUpperCase() || 'U'}
							</div>
							<div>
								<p className='text-foreground font-medium'>{displayName}</p>
								<p className='text-muted-foreground text-xs'>{u.email}</p>
							</div>
						</div>
					)
				},
			},
			{
				accessorKey: 'role',
				enableSorting: true,
				header: 'Role',
				cell: ({ row }) => getRoleBadge(row.original.role),
			},
			{
				accessorKey: 'status',
				enableSorting: true,
				header: 'Status',
				cell: ({ row }) => getStatusBadge(row.original.status),
			},
			{
				accessorKey: 'createdAt',
				enableSorting: true,
				header: 'Joined Date',
				cell: ({ row }) => (
					<span className='text-muted-foreground text-xs'>
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
							<IconButton
								title='Edit'
								aria-label={`Edit ${u.email}`}
								onClick={() => setSelectedUser(u)}>
								<Pencil />
							</IconButton>
							{u.email !== currentUser?.email ? (
								<IconButton
									variant='danger'
									title='Delete'
									aria-label={`Delete ${u.email}`}
									onClick={() => setUserToDelete(u)}>
									<Trash2 />
								</IconButton>
							) : null}
						</div>
					)
				},
			},
		],
		[currentUser?.email],
	)

	return (
		<div className='space-y-6'>
			<PageHeader
				title='Users & Access Control'
				description='Manage authenticated administrative personnel, granular RBAC roles, and security permissions.'>
				<RefreshButton loading={loading} onClick={loadUsers} />
				<Button variant='signal' size='sm' onClick={() => setIsCreateOpen(true)}>
					<Plus className='mr-1.5 size-4' />
					Add Personnel
				</Button>
			</PageHeader>

			{error && <ErrorBanner message={error} onRetry={loadUsers} />}

			<div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
				<CountCard label='Total Personnel' value={total} loaded={Boolean(data)} />
				<CountCard
					label='Administrators'
					value={adminCount}
					loaded={Boolean(data)}
					valueClassName='text-signal-ink'
				/>
				<CountCard
					label='Content Editors'
					value={editorCount}
					loaded={Boolean(data)}
					valueClassName='text-blue-500'
				/>
				<CountCard
					label='Active Accounts'
					value={activeCount}
					loaded={Boolean(data)}
					valueClassName='text-emerald-500'
				/>
			</div>

			<DataTable
				columns={columns}
				data={users}
				loading={loading}
				totalCount={total}
				pageSize={10}
				filters={userFilters}
			/>

			<UserCreateDialog
				open={isCreateOpen}
				onOpenChange={setIsCreateOpen}
				onCreated={() => loadUsers()}
			/>

			<UserEditDialog
				user={selectedUser}
				onClose={() => setSelectedUser(null)}
				onUpdated={() => loadUsers()}
			/>

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
