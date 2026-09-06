'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
	Activity,
	ArrowUpRight,
	Database,
	FolderKanban,
	Gauge,
	Image as ImageIcon,
	Inbox,
	Plus,
	Server,
	ShieldCheck,
	Sparkles,
} from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { adminFetch } from '@/lib/api-client'

export type DashboardMetrics = {
	projectsCount: number
	publishedProjects: number
	inboxCount: number
	unreadInquiries: number
	mediaCount: number
	auditEventsCount: number
	recentContacts: Array<{
		id: string
		name: string
		email: string
		subject: string
		createdAt: string
		status: string
	}>
	recentAudits: Array<{
		id: string
		actor: string
		action: string
		entity: string
		createdAt: string
	}>
}

export const DashboardClientView = () => {
	const [metrics, setMetrics] = useState<DashboardMetrics>({
		projectsCount: 0,
		publishedProjects: 0,
		inboxCount: 0,
		unreadInquiries: 0,
		mediaCount: 0,
		auditEventsCount: 0,
		recentContacts: [],
		recentAudits: [],
	})
	const [_loading, setLoading] = useState(true)

	useEffect(() => {
		const loadDashboard = async () => {
			try {
				const [projectsRes, contactsRes, mediaRes, auditsRes] = await Promise.all([
					adminFetch<{ items?: Array<{ status: string }> } | Array<{ status: string }>>(
						'/api/v1/projects',
					),
					adminFetch<{
						items?: Array<{
							id: string
							name: string
							email: string
							subject: string
							createdAt: string
							status: string
						}>
						unreadCount?: number
					} | Array<{
						id: string
						name: string
						email: string
						subject: string
						createdAt: string
						status: string
					}>>('/api/v1/contacts?limit=5'),
					adminFetch<{ items?: unknown[]; pagination?: { total: number } } | unknown[]>(
						'/api/v1/media',
					),
					adminFetch<{
						items?: Array<{
							id: string
							actor: string
							action: string
							entity: string
							createdAt: string
						}>
					} | Array<{
						id: string
						actor: string
						action: string
						entity: string
						createdAt: string
					}>>('/api/v1/audit-logs?limit=5'),
				])

				const projectItems = Array.isArray(projectsRes.data)
					? projectsRes.data
					: (projectsRes.data?.items || [])
				const publishedCount = projectItems.filter(p => p.status === 'PUBLISHED').length

				const contactItems = Array.isArray(contactsRes.data)
					? contactsRes.data
					: (contactsRes.data?.items || [])
				const unreadCount =
					(contactsRes.data && !Array.isArray(contactsRes.data) && contactsRes.data.unreadCount !== undefined)
						? contactsRes.data.unreadCount
						: contactItems.filter(c => c.status === 'UNREAD').length

				const mediaCount =
					mediaRes.count ??
					(mediaRes.data && !Array.isArray(mediaRes.data) && mediaRes.data.pagination?.total !== undefined
						? mediaRes.data.pagination.total
						: Array.isArray(mediaRes.data)
							? mediaRes.data.length
							: (mediaRes.data?.items?.length ?? 0))

				const auditItems = Array.isArray(auditsRes.data)
					? auditsRes.data
					: (auditsRes.data?.items || [])
				const auditCount = auditsRes.count ?? auditItems.length

				setMetrics({
					projectsCount: projectItems.length,
					publishedProjects: publishedCount,
					inboxCount: contactItems.length,
					unreadInquiries: unreadCount,
					mediaCount,
					auditEventsCount: auditCount,
					recentContacts: contactItems.slice(0, 5),
					recentAudits: auditItems.slice(0, 5),
				})
			} catch (err) {
				console.error('Failed to load dashboard metrics:', err)
			} finally {
				setLoading(false)
			}
		}

		loadDashboard()
	}, [])

	return (
		<div className='space-y-8'>
			{/* Welcome Banner */}
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border bg-gradient-to-r from-surface to-surface-strong/60 p-6 sm:p-8 shadow-xs'>
				<div>
					<div className='flex items-center gap-2 font-mono text-xs text-signal-ink'>
						<Sparkles className='size-3.5' />
						<span className='font-semibold uppercase tracking-wider'>Administration Console</span>
					</div>
					<h1 className='mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground'>
						Welcome back, Koushik
					</h1>
					<p className='mt-1 text-sm text-muted-foreground'>
						Manage production portfolio content, review visitor inquiries, and audit system
						mutations.
					</p>
				</div>

				<div className='flex flex-wrap items-center gap-2.5'>
					<Button asChild variant='signal'>
						<Link href='/content/projects'>
							<Plus className='size-4' />
							<span>New Project</span>
						</Link>
					</Button>
					<Button asChild variant='outline'>
						<Link href='/media'>
							<ImageIcon className='size-4' />
							<span>Media S3</span>
						</Link>
					</Button>
				</div>
			</div>

			{/* Metric Stat Cards */}
			<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
				{/* Projects Card */}
				<div className='rounded-2xl border border-border bg-surface p-5 space-y-3 shadow-xs'>
					<div className='flex items-center justify-between text-muted-foreground'>
						<span className='font-mono text-xs uppercase tracking-wider'>Projects</span>
						<FolderKanban className='size-4 text-signal-ink' />
					</div>
					<div className='flex items-baseline justify-between'>
						<span className='font-display text-3xl font-bold tracking-tight text-foreground'>
							{metrics.projectsCount}
						</span>
						<Badge variant='success'>{metrics.publishedProjects} Published</Badge>
					</div>
					<Link
						href='/content/projects'
						className='inline-flex items-center gap-1 font-mono text-[0.6875rem] text-signal-ink hover:underline'>
						<span>Manage projects</span>
						<ArrowUpRight className='size-3' />
					</Link>
				</div>

				{/* Inquiries Card */}
				<div className='rounded-2xl border border-border bg-surface p-5 space-y-3 shadow-xs'>
					<div className='flex items-center justify-between text-muted-foreground'>
						<span className='font-mono text-xs uppercase tracking-wider'>Contact Inbox</span>
						<Inbox className='size-4 text-signal-ink' />
					</div>
					<div className='flex items-baseline justify-between'>
						<span className='font-display text-3xl font-bold tracking-tight text-foreground'>
							{metrics.inboxCount}
						</span>
						{metrics.unreadInquiries > 0 ? (
							<Badge variant='signal'>{metrics.unreadInquiries} Unread</Badge>
						) : (
							<Badge variant='secondary'>All Read</Badge>
						)}
					</div>
					<Link
						href='/messages'
						className='inline-flex items-center gap-1 font-mono text-[0.6875rem] text-signal-ink hover:underline'>
						<span>Open inbox</span>
						<ArrowUpRight className='size-3' />
					</Link>
				</div>

				{/* Media S3 Assets */}
				<div className='rounded-2xl border border-border bg-surface p-5 space-y-3 shadow-xs'>
					<div className='flex items-center justify-between text-muted-foreground'>
						<span className='font-mono text-xs uppercase tracking-wider'>Media Assets</span>
						<ImageIcon className='size-4 text-signal-ink' />
					</div>
					<div className='flex items-baseline justify-between'>
						<span className='font-display text-3xl font-bold tracking-tight text-foreground'>
							{metrics.mediaCount}
						</span>
						<Badge variant='outline'>AWS S3</Badge>
					</div>
					<Link
						href='/media'
						className='inline-flex items-center gap-1 font-mono text-[0.6875rem] text-signal-ink hover:underline'>
						<span>Media library</span>
						<ArrowUpRight className='size-3' />
					</Link>
				</div>

				{/* Audit Log Activity */}
				<div className='rounded-2xl border border-border bg-surface p-5 space-y-3 shadow-xs'>
					<div className='flex items-center justify-between text-muted-foreground'>
						<span className='font-mono text-xs uppercase tracking-wider'>Audit Trail</span>
						<Activity className='size-4 text-signal-ink' />
					</div>
					<div className='flex items-baseline justify-between'>
						<span className='font-display text-3xl font-bold tracking-tight text-foreground'>
							{metrics.auditEventsCount}
						</span>
						<Badge variant='secondary'>Audited</Badge>
					</div>
					<Link
						href='/audit-logs'
						className='inline-flex items-center gap-1 font-mono text-[0.6875rem] text-signal-ink hover:underline'>
						<span>View activity logs</span>
						<ArrowUpRight className='size-3' />
					</Link>
				</div>
			</div>

			{/* Operational Grid: Inquiries + Audits */}
			<div className='grid gap-6 lg:grid-cols-12'>
				{/* Recent Inquiries List */}
				<div className='lg:col-span-7 rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-4'>
					<div className='flex items-center justify-between border-b border-border pb-4'>
						<div className='flex items-center gap-2'>
							<Inbox className='size-4 text-signal-ink' />
							<h2 className='font-display font-semibold text-foreground text-base'>
								Recent Inquiries
							</h2>
						</div>
						<Button asChild variant='ghost' size='sm'>
							<Link href='/messages'>View all</Link>
						</Button>
					</div>

					{metrics.recentContacts.length === 0 ? (
						<div className='py-8 text-center text-sm text-muted-foreground'>
							No visitor inquiries in inbox.
						</div>
					) : (
						<div className='divide-y divide-border'>
							{metrics.recentContacts.map(contact => (
								<div
									key={contact.id}
									className='flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3.5 transition-colors hover:bg-accent/30 rounded-lg px-2'>
									<div className='min-w-0 space-y-1'>
										<div className='flex items-center gap-2'>
											<span className='font-sans text-sm font-semibold text-foreground truncate'>
												{contact.name}
											</span>
											{contact.status === 'UNREAD' && <Badge variant='signal'>New</Badge>}
										</div>
										<p className='truncate font-mono text-xs text-muted-foreground'>
											{contact.subject}
										</p>
									</div>
									<div className='flex items-center justify-between sm:justify-end gap-3 shrink-0 font-mono text-xs'>
										<span className='text-muted-foreground text-[0.6875rem]'>
											{new Date(contact.createdAt).toLocaleDateString('en-US', {
												month: 'short',
												day: 'numeric',
											})}
										</span>
										<Button asChild size='sm' variant='outline'>
											<Link href={`/messages?id=${contact.id}`}>Review</Link>
										</Button>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* System Telemetry & Quick Health */}
				<div className='lg:col-span-5 space-y-6'>
					{/* System Health Card */}
					<div className='rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-4'>
						<div className='flex items-center justify-between border-b border-border pb-3'>
							<div className='flex items-center gap-2'>
								<Gauge className='size-4 text-signal-ink' />
								<h2 className='font-display font-semibold text-foreground text-base'>
									System Infrastructure
								</h2>
							</div>
							<span className='size-2 rounded-full bg-success animate-pulse' />
						</div>

						<div className='space-y-3 font-mono text-xs'>
							<div className='flex items-center justify-between py-1.5 border-b border-border/50'>
								<span className='flex items-center gap-2 text-muted-foreground'>
									<Database className='size-3.5' />
									<span>PostgreSQL 16 (Prisma 7)</span>
								</span>
								<span className='text-success font-semibold'>Healthy</span>
							</div>
							<div className='flex items-center justify-between py-1.5 border-b border-border/50'>
								<span className='flex items-center gap-2 text-muted-foreground'>
									<Server className='size-3.5' />
									<span>NestJS 11 Gateway API</span>
								</span>
								<span className='text-success font-semibold'>Online (v1)</span>
							</div>
							<div className='flex items-center justify-between py-1.5 border-b border-border/50'>
								<span className='flex items-center gap-2 text-muted-foreground'>
									<ImageIcon className='size-3.5' />
									<span>AWS S3 Object Store</span>
								</span>
								<span className='text-success font-semibold'>Presigned PUT</span>
							</div>
							<div className='flex items-center justify-between py-1.5'>
								<span className='flex items-center gap-2 text-muted-foreground'>
									<ShieldCheck className='size-3.5' />
									<span>Auth Provider</span>
								</span>
								<span className='text-foreground font-semibold'>Firebase Admin</span>
							</div>
						</div>
					</div>

					{/* Recent Audit Log Preview */}
					<div className='rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-3'>
						<div className='flex items-center justify-between border-b border-border pb-3'>
							<div className='flex items-center gap-2'>
								<Activity className='size-4 text-signal-ink' />
								<h2 className='font-display font-semibold text-foreground text-sm'>
									Recent Mutations
								</h2>
							</div>
							<Link
								href='/audit-logs'
								className='font-mono text-[0.6875rem] text-signal-ink hover:underline'>
								View all
							</Link>
						</div>

						{metrics.recentAudits.length === 0 ? (
							<div className='py-6 text-center text-xs text-muted-foreground font-sans'>
								No recorded mutations yet.
							</div>
						) : (
							<div className='space-y-2.5 font-mono text-xs'>
								{metrics.recentAudits.map(audit => (
									<div key={audit.id} className='flex items-center justify-between py-1'>
										<div className='min-w-0 flex items-center gap-2'>
											<Badge variant={audit.action === 'DELETE' ? 'destructive' : 'secondary'}>
												{audit.action}
											</Badge>
											<span className='truncate text-foreground text-xs font-sans'>
												{audit.entity}
											</span>
										</div>
										<span className='text-[0.625rem] text-muted-foreground shrink-0'>
											{new Date(audit.createdAt).toLocaleTimeString([], {
												hour: '2-digit',
												minute: '2-digit',
											})}
										</span>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
